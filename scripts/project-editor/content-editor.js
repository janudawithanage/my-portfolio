/* Schema-driven forms for local portfolio content. Never imported into the public app. */
/** Collapsed-card title: a custom resolver, else the first meaningful text field. */
function entryTitle(spec, entry) {
  if (spec.itemTitle) return spec.itemTitle(entry);
  const text = entry.title || entry.role || entry.institution || entry.label || entry.name || entry.quote || entry.text || entry.value;
  return text ? (text.length > 80 ? text.slice(0, 77) + "…" : text) : `New ${spec.itemLabel}`;
}

/**
 * "Hidden on my portfolio" switch for one entry. Hiding keeps every detail in
 * content.json and only stops the portfolio showing it, so it can come back
 * with one click. The flag is deleted rather than set to false, so an entry
 * that was never hidden stays clean on disk.
 */
export function hideToggle(entry, element, onChange) {
  const label = element("label", "checkbox-label hide-toggle");
  const input = element("input");
  input.type = "checkbox"; input.checked = Boolean(entry.hidden);
  input.addEventListener("change", () => {
    if (input.checked) entry.hidden = true; else delete entry.hidden;
    onChange();
  });
  label.append(input, element("span", "", "Hidden on my portfolio"));
  return label;
}

export function renderContent(container, fields, value, { element, button, changed, upload, opened }) {
  container.replaceChildren();
  function render(specs, object, parent, prefix = "content") {
    for (const spec of specs) {
      if (spec.type === "collection") {
        const block = element("section", "content-collection");
        const heading = element("div", "section-heading");
        const title = element("h2", "", spec.label);
        const items = object[spec.name];
        heading.append(title);
        // Fixed lists (section order) can be reordered and edited, but not extended or shortened.
        if (!spec.fixed) heading.append(button(`Add ${spec.itemLabel}`, () => {
          const entry = structuredClone(spec.initial);
          if (spec.name !== "facts") entry.id = crypto.randomUUID();
          items.push(entry);
          opened.add(`${prefix}-${spec.name}-${entry.id ?? items.length - 1}`);
          rerender(); changed();
          const last = container.querySelectorAll(`[data-collection="${spec.name}"] > details`);
          last[last.length - 1]?.querySelector("input,textarea,select")?.focus();
        }, "primary"));
        block.append(heading);
        if (!items.length && !spec.fixed) block.append(element("p", "empty", "No entries yet. Add your own details when you’re ready."));
        const list = element("div");
        list.dataset.collection = spec.name;
        items.forEach((entry, index) => {
          const key = `${prefix}-${spec.name}-${entry.id ?? index}`;
          const card = element("details", "project");
          card.id = key; card.open = opened.has(key);
          card.addEventListener("toggle", () => { if (card.open) opened.add(key); else opened.delete(key); });
          const summary = element("summary");
          // Hidden entries say so in their collapsed title, so nothing disappears without a reason.
          const titleFor = () => entryTitle(spec, entry) + (entry.hidden ? " — hidden" : "");
          const label = element("strong", "project-title", titleFor());
          card.classList.toggle("is-hidden", Boolean(entry.hidden));
          summary.append(element("span", "project-number", String(index + 1).padStart(2, "0")), label);
          const body = element("div", "project-body");
          const tools = element("div", "project-actions");
          const moves = element("div", "actions");
          for (const direction of [-1, 1]) {
            const move = button(direction < 0 ? "↑ Move up" : "↓ Move down", () => {
              [items[index], items[index + direction]] = [items[index + direction], items[index]];
              rerender(); changed(); document.getElementById(key)?.querySelector("summary")?.focus();
            });
            move.disabled = index + direction < 0 || index + direction >= items.length;
            moves.append(move);
          }
          tools.append(moves);
          // Fixed lists (section order) already have their own "Show this section" switch.
          if (!spec.fixed) tools.append(hideToggle(entry, element, () => {
            label.textContent = titleFor();
            card.classList.toggle("is-hidden", Boolean(entry.hidden));
            changed();
          }));
          if (!spec.fixed) tools.append(button(`Remove ${spec.itemLabel}`, () => {
            if (!window.confirm(`Remove ${entryTitle(spec, entry)}? Save changes to apply the removal.`)) return;
            items.splice(index, 1); opened.delete(key); rerender(); changed();
            container.querySelector(`[data-collection="${spec.name}"]`)?.parentElement.querySelector("button")?.focus();
          }, "danger"));
          const nested = element("div", "project-fields");
          render(spec.fields, entry, nested, key);
          const relabel = () => { label.textContent = titleFor(); };
          nested.addEventListener("input", relabel);
          nested.addEventListener("change", relabel);
          body.append(tools, nested); card.append(summary, body); list.append(card);
        });
        block.append(list); parent.append(block);
        continue;
      }
      if (spec.type === "image") {
        const block = element("div", "content-image");
        const preview = element("div", "preview");
        if (object[spec.name]) {
          const image = element("img"); image.src = object[spec.name]; image.alt = spec.label;
          image.addEventListener("error", () => preview.replaceChildren(element("p", "preview-placeholder", "Image unavailable. Upload a replacement.")));
          preview.append(image);
        } else preview.append(element("p", "preview-placeholder", "Optional supporting photo, certificate, or logo."));
        const label = element("label", "", spec.label);
        const input = element("input"); input.type = "file"; input.accept = "image/png,image/jpeg,image/webp";
        input.addEventListener("change", async () => {
          const file = input.files[0]; if (!file) return;
          await upload(file, result => { object[spec.name] = result.image; rerender(); changed(); });
          input.value = "";
        });
        label.append(input); block.append(preview, label, element("p", "muted image-note", "Still PNG, JPEG or WebP · up to 10 MB / 40 megapixels · saved with this section"));
        if (spec.optional && object[spec.name]) block.append(button("Remove image", () => { delete object[spec.name]; rerender(); changed(); }));
        parent.append(block);
        continue;
      }
      if (spec.type === "cv") {
        parent.append(cvField(spec, object));
        continue;
      }
      if (spec.type === "checkbox") {
        const label = element("label", "checkbox-label");
        const input = element("input");
        input.type = "checkbox"; input.dataset.field = spec.name; input.checked = Boolean(object[spec.name]);
        input.addEventListener("change", () => { object[spec.name] = input.checked; changed(); });
        label.append(input, element("span", "", spec.label));
        parent.append(label);
        continue;
      }
      const label = element("label", "", spec.label);
      const multiline = ["textarea", "lines", "skills"].includes(spec.type);
      const input = element(spec.type === "select" ? "select" : multiline ? "textarea" : "input");
      input.dataset.field = spec.name;
      if (spec.type === "select") {
        for (const [key, name] of spec.options) { const option = element("option", "", name); option.value = key; input.append(option); }
      } else if (multiline) input.rows = spec.type === "textarea" ? 4 : 5;
      else input.type = ["url", "email", "tel"].includes(spec.type) ? spec.type : "text";
      if (spec.placeholder) input.placeholder = spec.placeholder;
      input.value = spec.type === "lines" ? object[spec.name].join("\n") : spec.type === "skills" ? object[spec.name].map(skill => skill.name).join("\n") : object[spec.name] ?? "";
      input.required = !spec.optional && !["lines", "skills"].includes(spec.type);
      if (spec.type !== "select") input.maxLength = multiline ? 60000 : 2048;
      input.addEventListener("input", () => {
        if (spec.type === "lines") object[spec.name] = input.value.split("\n").map(line => line.trim()).filter(Boolean);
        else if (spec.type === "skills") {
          const previous = new Map(object[spec.name].map(skill => [skill.name, skill]));
          object[spec.name] = [...new Set(input.value.split("\n").map(line => line.trim()).filter(Boolean))].map(name => previous.get(name) ?? { name });
        } else if (!input.value && spec.optional && !spec.keepEmpty) delete object[spec.name];
        else object[spec.name] = input.value;
        changed();
      });
      label.append(input); parent.append(label);
    }
  }
  /** CV upload: shows what visitors get, then lets the owner upload, preview or remove the PDF. */
  function cvField(spec, object) {
    const value = object[spec.name];
    const block = element("div", "content-cv");
    const status = element("div", "cv-status");
    const badge = element("span", "cv-badge", "PDF"); badge.setAttribute("aria-hidden", "true");
    const copy = element("div", "cv-copy");
    const title = element("strong");
    const detail = element("p", "muted");
    const open = element("a", "cv-open", "Open PDF");
    open.target = "_blank"; open.rel = "noopener";
    const label = element("label");
    const labelText = element("span", "", "Upload CV (PDF)");
    const show = (heading, text, href, state = "") => {
      title.textContent = heading; detail.textContent = text; status.dataset.state = state;
      labelText.textContent = ["empty", "missing"].includes(state) ? "Upload CV (PDF)" : "Replace CV (PDF)";
      if (href) { open.href = href; open.hidden = false; } else open.hidden = true;
    };
    copy.append(title, detail);
    status.append(badge, copy, open);
    if (!value) show("No CV yet", "Upload a PDF to show a download button on your portfolio.", null, "empty");
    else if (value.startsWith("/staged/")) show("New CV ready", "Save changes to publish it on your portfolio.", value, "new");
    else if (/^https?:\/\//i.test(value)) show("Linked CV", value, value);
    else {
      show("Checking your CV…", value, null);
      fetch(value, { method: "HEAD" }).then(response => {
        if (response.ok) show("Your CV is live", `Visitors download it from ${value}.`, value, "live");
        else show("CV file missing", `${value} isn’t in your project, so the portfolio hides the CV button. Upload your CV PDF.`, null, "missing");
      }, () => show("CV file missing", "Upload your CV PDF.", null, "missing"));
    }
    const input = element("input"); input.type = "file"; input.accept = "application/pdf,.pdf";
    input.addEventListener("change", async () => {
      const file = input.files[0]; if (!file) return;
      await upload(file, result => { object[spec.name] = result.cv; rerender(); changed(); }, "cv");
      input.value = "";
    });
    label.append(labelText, input);
    block.append(status, label, element("p", "muted image-note", "PDF · up to 10 MB · saved as /cv/Your-Name-CV.pdf when you save this section"));
    if (value) block.append(button("Remove CV", () => {
      if (!window.confirm("Remove the CV from your portfolio? The download button disappears after you save. The PDF file itself stays in your project.")) return;
      delete object[spec.name]; rerender(); changed();
    }));
    return block;
  }
  function rerender() { renderContent(container, fields, value, { element, button, changed, upload, opened }); }
  render(fields, value, container);
}
