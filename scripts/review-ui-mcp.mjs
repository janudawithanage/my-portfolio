import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const root = process.cwd();
const browser = process.argv[2] || "chrome";
const phase = process.argv[3] || "review";
const baseUrl = process.argv[4] || process.env.PORTFOLIO_REVIEW_URL || "http://127.0.0.1:3000";
await mkdir(root + "/artifacts/ui-review", { recursive: true });
const child = spawn(process.execPath, [root + "/node_modules/@playwright/mcp/cli.js", "--headless", "--isolated", "--browser", browser, "--output-dir", "artifacts/ui-review", "--snapshot-mode", "none"], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
let buffer = "";
let nextId = 1;
const pending = new Map();
let serverErrors = "";
child.stderr.on("data", chunk => { serverErrors += chunk.toString(); });
child.stdout.on("data", chunk => {
  buffer += chunk.toString();
  let newline;
  while ((newline = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
    if (!line.trim()) continue;
    const message = JSON.parse(line);
    const request = pending.get(message.id);
    if (request) {
      pending.delete(message.id); clearTimeout(request.timer);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
  }
});
child.on("exit", () => { for (const request of pending.values()) { clearTimeout(request.timer); request.reject(new Error("MCP exited: " + serverErrors)); } pending.clear(); });
function rpc(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(method + " timed out: " + serverErrors)); }, 90000);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}
async function tool(name, args = {}) {
  const result = await rpc("tools/call", { name, arguments: args });
  const content = (result.content || []).filter(item => item.type === "text").map(item => item.text).join("\n");
  if (result.isError) throw new Error(name + ": " + content);
  return content;
}
try {
  await rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "portfolio-ui-review", version: "1.0" } });
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  const listing = await rpc("tools/list");
  console.log("Microsoft Playwright MCP connected: " + browser + " (" + listing.tools.length + " tools)");
  console.log((await tool("browser_navigate", { url: baseUrl })).slice(0, 500));
  if (phase === "review") {
    const result = await tool("browser_run_code_unsafe", { code: `async (page) => {
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const matrix = [];
      for (const [width, height] of [[320,844],[375,844],[390,844],[430,932],[639,900],[640,900],[767,1024],[768,1024],[1023,900],[1024,900],[1440,1000],[1920,1080],[844,390],[1024,768]]) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => window.scrollTo({top:0,behavior:"instant"}));
        const metrics = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll("main h1, main h2, main h3, main p, main a, main li > span"));
          const clipped = elements.filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2 && !e.closest('[aria-hidden="true"]')).map(e => ({tag:e.tagName,text:e.textContent.slice(0,90),width:e.clientWidth,scroll:e.scrollWidth}));
          const targets = Array.from(document.querySelectorAll("a,button,input,summary")).filter(e => {const r=e.getBoundingClientRect();return r.height>0 && r.width>0 && !e.classList.contains("skip-link");});
          const smallTargets = targets.filter(e => e.getBoundingClientRect().height<43.5).map(e=>({text:e.textContent.slice(0,60),height:e.getBoundingClientRect().height}));
          const action = document.querySelector(".hero-actions a").getBoundingClientRect();
          return {width:innerWidth,height:innerHeight,pageWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,hero:Math.round(document.querySelector("#hero").getBoundingClientRect().height),primaryActionBottom:Math.round(action.bottom),clipped,smallTargets};
        });
        matrix.push(metrics);
        if ([320,390,768,1440,1920].includes(width) && height>800) {
          await page.screenshot({animations:"disabled",path:"artifacts/ui-review/${browser}-hero-"+width+".png"});
          if (width===390||width===1440) {
            for (const id of ["projects","about","skills","experience","education","github","contact"]) {
              const section=page.locator("#"+id);
              const images=section.locator("img");
              for (let i=0;i<await images.count();i++) {
                const image=images.nth(i);
                await image.scrollIntoViewIfNeeded();
                await image.evaluate(element=>element.decode());
              }
              await section.screenshot({animations:"disabled",style:".site-header,.skip-link{visibility:hidden!important;}",path:"artifacts/ui-review/${browser}-"+id+"-"+width+".png"});
            }
          }
        }
      }
      await page.setViewportSize({width:390,height:844});
      await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
      await page.getByRole("button",{name:"Open navigation menu"}).click();
      await page.getByRole("dialog").waitFor({state:"visible"});
      await page.screenshot({animations:"disabled",path:"artifacts/ui-review/${browser}-menu-390.png"});
      for (let i=0;i<9;i++) await page.keyboard.press("Tab");
      const trapped = await page.evaluate(()=>Boolean(document.activeElement.closest("dialog")));
      await page.keyboard.press("Escape");
      const restored = await page.getByRole("button",{name:"Open navigation menu"}).evaluate(e=>e===document.activeElement);
      await page.getByRole("button",{name:"Open navigation menu"}).click();
      await page.getByRole("navigation",{name:"Mobile navigation"}).getByRole("link",{name:"Work",exact:true}).click();
      await page.waitForTimeout(300);
      const anchor=await page.evaluate(()=>({hash:location.hash,focus:document.activeElement.id,locked:document.body.style.overflow}));
      const details=page.locator("#experience details").first();
      await details.locator("summary").click();
      const highlightsOpen=await details.evaluate(e=>e.open);
      const more=page.getByRole("button",{name:/Show all.*repositories/});
      let repositories=null;
      if(await more.count()) {await more.click();repositories={expanded:await page.getByRole("button",{name:"Show fewer"}).getAttribute("aria-expanded"),count:await page.locator("#github-repositories article").count()};}
      await page.emulateMedia({reducedMotion:"reduce"});
      const reduced=await page.evaluate(()=>({scroll:getComputedStyle(document.documentElement).scrollBehavior,headingOpacity:getComputedStyle(document.querySelector("h1")).opacity}));
      return {matrix,interaction:{trapped,restored,anchor,highlightsOpen,repositories,reduced},formButton:await page.locator("#contact button[type=submit]").innerText()};
    }` });
    const match = result.match(/### Result\s*([\s\S]*?)\n### /);
    if (!match) throw new Error("MCP did not return review metrics.");
    const review = JSON.parse(match[1]);
    console.log(JSON.stringify(review, null, 2));
    const badLayout = review.matrix.some(item => item.pageWidth > item.width || item.clipped.length || item.smallTargets.length);
    const badInteraction = !review.interaction.trapped || !review.interaction.restored || review.interaction.anchor.hash !== "#projects" || review.interaction.anchor.locked !== "" || !review.interaction.highlightsOpen;
    if (badLayout || badInteraction) throw new Error("The MCP review found a layout or interaction regression.");
    await writeFile(root + "/artifacts/ui-review/" + browser + "-review.txt", result);
    console.log(await tool("browser_console_messages", { level: "error" }));
  } else if (phase === "draft") {
    console.log(await tool("browser_run_code_unsafe", { code: `async(page)=>{
      await page.getByLabel("Name",{exact:true}).fill("UI test");
      await page.getByLabel("Email",{exact:true}).fill("ui@example.com");
      await page.getByLabel("Subject",{exact:true}).fill("Portfolio UI review");
      await page.getByLabel("Message",{exact:true}).fill("Testing the email draft fallback without sending a message.");
      const requests=[];const handler=request=>{if(request.method()==="POST")requests.push(request.url());};
      page.on("request",handler);
      await page.getByRole("button",{name:"Open email draft",exact:true}).click();
      await page.getByRole("status").filter({hasText:"email draft"}).waitFor({state:"visible"});
      page.off("request",handler);
      return {notice:await page.getByRole("status").innerText(),posts:requests,fieldsRetained:await page.getByLabel("Name",{exact:true}).inputValue(),fakeSuccess:await page.getByText("Thanks for reaching out.").count()};
    }` }));
  }
  await tool("browser_close");
} finally { child.kill(); }
