// @ts-ignore
import hljs from './highlight/min';
import Color from 'color';
let inpTxt;
const Update = ()=>{
//   const codeText = `local path = game:GetService('Workspace'):WaitForChild('path'); -- Get the path
// local plr = game:GetService('Players').LocalPlayer; -- Our own player
// for _, part in pairs(path:GetChildren()) do -- Loops over every path (direct descendant of path
//   if part:IsA('Part') then -- If it is actully a part, and not something else
//     plr.Character:SetPrimaryPartCFrame(part.CFrame) -- SetPrimaryPartCFrame is way more robust than setting the primarypart's CFrame; setting the primary part (HumanoidRootPart) is still fine though
//     task.wait(1 / 144); -- Wait a bit; let the server give us the badge | Typically people set their FPS unlockers to ~144fps, and rarely above that, so 1/144 seconds should be fine
//   end;
// end;`;
  inpTxt = inpTxt ?? document.querySelector('#inputText');
  // @ts-ignore
  const codeText = inpTxt.value;
  // @ts-ignore
  const code:HTMLPreElement = document.querySelector('pre');
  code.textContent = codeText;
  // @ts-ignore
  hljs.highlightElement(code);
  const _elements = code.querySelectorAll('span');
  let elements: Element[] = [];
  _elements.forEach(v=>elements.push(v));
  elements = elements.filter(v=>v.childElementCount === 0);
  // @ts-ignore
  let text: string = code.textContent;
  interface Segment {
    text: string,
    color: string,
    bold: boolean,
  }
  const segments: Segment[] = [];
  const defaultComputed = getComputedStyle(code);
  const defaultColor = Color(defaultComputed.color).hex();
  const defaultWeight = defaultComputed.fontWeight;
  let isFirst = true;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    // @ts-ignore
    const txt: string = element.textContent;
    const computed = getComputedStyle(element);
    const txtColor = computed.color;
    const txtWeight = computed.fontWeight;
    const isBold = txtWeight > defaultWeight;
    const find = text.indexOf(txt);
    let preText = text.substring(0, find);
    if (isFirst && text.startsWith(preText))
      preText = '';
    if (preText.length !== 0)
      segments.push({
        'text': preText, 'color': defaultColor, 'bold': false,
      });
    segments.push({
      'text': txt, 'color': Color(txtColor).hex(), 'bold': isBold
    });
    text = text.substring(find + txt.length);
    isFirst = false;
  }
  segments.push({
    'text': text, 'color': defaultColor, 'bold': false,
  });
  const Data: string[] = [];
  segments.forEach(segment=>{
    let str = segment.text;
    if (segment.color !== defaultColor)
      str = `[color=${segment.color}]${str}[/color]`;
    if (segment.bold)
      str = `[b]${str}[/b]`;
    Data.push(str);
  });
  const output = Data.join('');
  // @ts-ignore
  const bbcode: HTMLPreElement = document.querySelector('.container.bbcode > pre');
  bbcode.textContent = output;
  // hljs.highlightElement(bbcode);
};

document.addEventListener('DOMContentLoaded', ()=>{
  // @ts-ignore
  const code:HTMLPreElement = document.querySelector('pre');
  code.classList.add(`language-${document.location.hash.replace('#', '') || 'lua'}`);
  Update();
  inpTxt.addEventListener('keyup', Update);
});
