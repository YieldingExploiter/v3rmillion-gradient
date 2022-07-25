(()=>{
  // @ts-ignore
  const lerp = require('color-lerp');
  // @ts-ignore
  let gradient = window.gradient;
  const formatString = (input:string, blockSize:number, gradientValues:string[]) =>{
    const eachLine:({
      bb: string,
      html: string
    })[] = [];
    const rawLines = input.split('\r\n').join('\n')
      .split('\n');
    rawLines.forEach(line=>eachLine.push(formatLine(line, blockSize, gradientValues)));
    const allLines = {
      'bb': '',
      'html': ''
    };
    eachLine.forEach((line, idx) => {
      allLines.bb += line.bb;
      allLines.html += line.html;
      if (idx !== eachLine.length - 1) {
        allLines.bb += '\n';
        allLines.html += '<br/>\n';
      }
    });
    return allLines;
  };
  const formatLine = (input:string, blockSize:number, gradientValues: string[] = [
    '#a32626', '#1d1b2d'
  ]) => {
    let inputSplit: string[] = [];
    // eslint-disable-next-line no-extra-parens
    input.split('').forEach((val, idx)=>(idx % blockSize === 0 ? inputSplit.push(val) : inputSplit[inputSplit.length - 1] += val));
    if (inputSplit.length <= 1)
      inputSplit = `too small input (line must be at least ${Number(blockSize) + 1} characters)`.split('');
    let grad:string[];
    try {
      grad = lerp(gradientValues[0], gradientValues[1], inputSplit.length, 'hex');
    } catch (error) {
      inputSplit = error.toString().split('');
      grad = lerp(gradientValues[0], gradientValues[1], inputSplit.length, 'hex');
    }
    return {
      'bb': inputSplit.map((val, idx)=>`[color=${grad[idx]}]${val}[/color]`).join(''),
      'html': inputSplit.map((val, idx)=>`<span style="color: ${grad[idx]}">${val}</span>`).join('')
    };
  };
  document.addEventListener('DOMContentLoaded', () =>{
    // @ts-ignore
    gradient = window.gradient;
    // const container = document.getElementById('container');
    const text = document.getElementById('input');
    const blockSize = document.getElementById('blocksize');
    const output = document.getElementById('output');
    const colours = document.querySelector('.colours');
    const colour = document.querySelector('[name="colour"]');
    if (!colours)
      throw new Error('no colour div loaded');
    if (!colour)
      throw new Error('no colour element loaded');
    if (!text)
      throw new Error('no input element loaded');
    const swapBtn = document.querySelector('button');
    swapBtn?.addEventListener('click', ()=>{
      const clrs = document.querySelectorAll('.colours > *');
      // @ts-ignore
      const val1 = clrs[1].value;
      // @ts-ignore
      clrs[1].value = clrs[0].value;
      // @ts-ignore
      clrs[0].value = val1;
    });
    const input = ()=>{
      const clrs:string[] = [];
      for (const it of document.querySelectorAll('.colours > *'))
        // @ts-ignore
        clrs.push(it.value);

      // @ts-ignore
      const formatted = formatString(text.value, blockSize.value, clrs);
      // @ts-ignore
      output.value = formatted.bb;
      // @ts-ignore
      document.querySelector('#preview').innerHTML = formatted.html;
      // input();
    };
    // for (const it of document.querySelectorAll('.colours > *')) {
    // // @ts-ignore
    // it.addEventListener('input',input)
    // }
    // text.addEventListener('keyup', input)
    setInterval(input, 500);
    input();
  });
})();
