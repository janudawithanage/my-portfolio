/* Schema-driven forms for local portfolio content. Never imported into the public app. */
export function renderContent(container, fields, value, { element, button, changed, upload, opened }) {
  container.replaceChildren();
  function render(specs, object, parent, prefix = "content") {
    for (const spec of specs) {
      if (spec.type === "collection") {
        const block = element("section", "content-collection");
        const heading = element("div", "section-heading");
        const title = element("h2", "", spec.label);
        const items = object[spec.name];
        heading.append(title, button(`Add ${spec.itemLabel}`, () => {
          const entry = structuredClone(spec.initial);
          if (spec.name !== "facts") entry.id = crypto.randomUUID();
          items.push(entry);
          opened.add(`${prefix}-${spec.name}-${entry.id ?? items.length - 1}`);
          rerender(); changed();
          const last = container.querySelectorAll(`[data-collection="${spec.name}"] > details`);
          last[last.length - 1]?.querySelector("input,textarea,select")?.focus();
        }, "primary"));
        block.append(heading);
        if (!items.length) block.append(element("p", "empty", "No entries yet. Add your own details when you’re ready."));
        const list = element("div");
        list.dataset.collection = spec.name;
        items.forEach((entry, index) => {
          const key = `${prefix}-${spec.name}-${entry.id ?? index}`;
          const card = element("details", "project");
          card.id = key; card.open = opened.has(key);
          card.addEventListener("toggle", () => { if (card.open) opened.add(key); else opened.delete(key); });
          const summary = element("summary");
          const label = element("strong", "project-title", entry.title || entry.role || entry.institution || entry.label || `New ${spec.itemLabel}`);
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
          tools.append(moves, button(`Remove ${spec.itemLabel}`, () => {
            if (!window.confirm(`Remove ${label.textContent}? Save changes to apply the removal.`)) return;
            items.splice(index, 1); opened.delete(key); rerender(); changed();
            container.querySelector(`[data-collection="${spec.name}"]`)?.parentElement.querySelector("button")?.focus();
          }, "danger"));
          const nested = element("div", "project-fields");
          render(spec.fields, entry, nested, key);
          nested.addEventListener("input", () => { label.textContent = entry.title || entry.role || entry.institution || entry.label || `New ${spec.itemLabel}`; });
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
      const label = element("label", "", spec.label);
      const multiline = ["textarea", "lines", "skills"].includes(spec.type);
      const input = element(spec.type === "select" ? "select" : multiline ? "textarea" : "input");
      input.dataset.field = spec.name;
      if (spec.type === "select") {
        for (const [key, name] of spec.options) { const option = element("option", "", name); option.value = key; input.append(option); }
      } else if (multiline) input.rows = spec.type === "textarea" ? 4 : 5;
      else input.type = ["url", "email"].includes(spec.type) ? spec.type : "text";
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
  function rerender() { renderContent(container, fields, value, { element, button, changed, upload, opened }); }
  render(fields, value, container);
}
