type preffixBrowser = 'webKit' | 'gecko' | 'css3';
type borderValues = [number?, number?, number?, number?];

export class BorderRadiusGenerate {
  private readonly UnitMeasurement = 'px';
  private readonly preffixBrowserSupport = {
    webKit: '-webkit-',
    gecko: '-moz-',
    css3: '',
  };
  private preffixBrowserSupportActive = {
    css3: true,
    gecko: false,
    webKit: false,
  };
  private borderSelector: string;

  constructor(selector: string) {
    this.borderSelector = selector;
    this.inputBrowserSupportForEach((input: HTMLInputElement) => {
      input.addEventListener(
        'click',
        this.handleChangeBrowserSupport.bind(this)
      );
    });
    this.inputBorderForEach((input: HTMLInputElement) => {
      input.addEventListener(
        'change',
        this.handleChangeBorderRadius.bind(this)
      );
    });
  }

  get borderBox(): HTMLDivElement {
    return document.querySelector(this.borderSelector);
  }

  inputBorderForEach(callback: Function): void {
    this.borderBox
      .querySelectorAll('input[type="text"]')
      .forEach((input: HTMLInputElement) => {
        callback(input);
      });
  }

  inputBrowserSupportForEach(callback: Function): void {
    this.borderBox
      .querySelectorAll('input[type="checkbox"]')
      .forEach((input: HTMLInputElement) => {
        callback(input);
      });
  }

  getBorderValues(): borderValues {
    const inputBorderValues: borderValues = [];
    this.inputBorderForEach((input: HTMLInputElement) => {
      let value = Number(input.value);
      value = isNaN(value) ? 0 : value;
      inputBorderValues.push(value);
    });
    return inputBorderValues;
  }
  haveOnlyOneBorderWithValue(): boolean {
    const inputBorderValuesNotZero = this.getBorderValues().filter(
      (border: number) => border !== 0
    );
    return inputBorderValuesNotZero.length === 1;
  }
  updateBorderValues(): void {
    const borders = this.getBorderValues();
    this.setBorderValues(borders);
  }
  setBorderValues(borders: borderValues): void {
    const inputBorders = this.borderBox.querySelectorAll('input[type="text"]');
    borders.forEach((value: number, index: number) => {
      inputBorders[index].setAttribute('value', String(value));
    });
    this.setBorderStyles(borders);
  }
  setBorderStyles(bordersValue: borderValues): void {
    const styleProperties: borderValues = [];
    bordersValue.forEach((value: number) => {
      styleProperties.push(value);
    });
    const borderRadiusValues = styleProperties.join(`${this.UnitMeasurement} `);
    const style = `border-radius: ${borderRadiusValues}${this.UnitMeasurement}`;
    const borderStyleHtmlContent = this.getBorderStylesHtmlContent(style);

    this.borderBox.querySelector('.box-radius').setAttribute('style', style);
    this.borderBox.querySelector(
      '.box-radius-content'
    ).innerHTML = borderStyleHtmlContent;
    this.borderBox.querySelector(
      '.box-radius-content-mobile'
    ).innerHTML = borderStyleHtmlContent;
  }

  getBorderStylesHtmlContent(instruction: string): string {
    let styleInstructionComputed = '';
    Object.keys(this.preffixBrowserSupportActive).forEach(
      (key: preffixBrowser) => {
        const isPreffixBrowserActive = this.preffixBrowserSupportActive[key];
        if (isPreffixBrowserActive) {
          const preffix = this.preffixBrowserSupport[key];
          styleInstructionComputed += `<span>${preffix}${instruction};</span>`;
        }
      }
    );
    return styleInstructionComputed;
  }
  handleChangeBrowserSupport(event: Event): void {
    const inputElement = <HTMLInputElement>event.target;
    const preffix = inputElement.value as preffixBrowser;
    const value = inputElement.checked;
    const allInputsBorderIsVoid = this.getBorderValues().every(
      (border: number) => border === 0
    );
    this.preffixBrowserSupportActive[preffix] = value;
    if (!allInputsBorderIsVoid) {
      this.updateBorderValues();
    }
  }

  handleChangeBorderRadius(event: Event): void {
    const inputElement = <HTMLInputElement>event.target;
    const value = Number(inputElement.value);
    if (this.haveOnlyOneBorderWithValue()) {
      this.setBorderValues([value, value, value, value]);
    } else {
      this.updateBorderValues();
    }
  }
}
