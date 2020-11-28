type borderKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
type preffixBrowser = 'webKit' | 'gecko' | 'css3';
type stylesBorder = {
  key: string;
  value: string;
};

export class BorderRadiusGenerate {
  private readonly UnitMeasurement = 'px';
  private readonly preffixBrowserSupport = {
    webKit: '-webkit-',
    gecko: '-moz-',
    css3: '',
  };
  private preffixBrowserSupportActive = {
    css3: true,
    gecko: true,
    webKit: true,
  };

  private readonly borderStyleProperty = {
    topLeft: 'border-top-left-radius',
    topRight: 'border-top-right-radius',
    bottomLeft: 'border-bottom-left-radius',
    bottomRight: 'border-bottom-right-radius',
  };
  private borderStyleValue = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
  };
  private borderSelector: string;

  constructor(selector: string) {
    this.borderSelector = selector;
    this.borderBox
      .querySelectorAll('input')
      .forEach((element: HTMLInputElement) => {
        element.addEventListener(
          'change',
          this.handleChangeBorderRadius.bind(this)
        );
      });
  }

  get borderBox(): HTMLDivElement {
    return document.querySelector(this.borderSelector);
  }
  setInitialBorderValues() {
    Object.keys(this.borderStyleProperty).forEach((key: string) => {});
  }
  interatorBorderStyleDataPreffix(callback: Function) {
    Object.keys(this.preffixBrowserSupportActive).forEach(
      (key: preffixBrowser) => {
        if (this.preffixBrowserSupportActive[key]) {
          callback(this.preffixBrowserSupport[key]);
        }
      }
    );
  }
  interatorBorderStyleData(callback: Function) {
    const styles: stylesBorder[] = [];
    if (this.isFirstBorderWithValue()) {
      let value = `${this.getBorderValueNotVoid()}${this.UnitMeasurement}`;
      styles.push({ key: 'border-radius', value });
    } else if (this.allBordersEqual()) {
      let value = `${this.borderStyleValue.topLeft}${this.UnitMeasurement}`;
      styles.push({ key: 'border-radius', value });
    } else {
      Object.keys(this.borderStyleProperty).forEach((key: borderKey) => {
        const propertyCSSName = this.borderStyleProperty[key];
        const propertyCSSValue = this.borderStyleValue[key];
        const value = `${propertyCSSValue}${this.UnitMeasurement}`;
        styles.push({ key: propertyCSSName, value });
      });
    }
    this.interatorBorderStyleDataPreffix((preffix: preffixBrowser) => {
      styles.forEach((data: stylesBorder) => {
        callback(`${preffix}${data.key}`, data.value);
      });
    });
  }
  getBorderValueNotVoid() {
    const direction = <borderKey>(
      Object.keys(this.borderStyleProperty).find(
        (key: borderKey) => this.borderStyleValue[key] !== 0
      )
    );
    return this.borderStyleValue[direction];
  }
  isFirstBorderWithValue() {
    const qntBordersValuesNotZero = Object.keys(
      this.borderStyleProperty
    ).filter((key: borderKey) => this.borderStyleValue[key] !== 0);
    return Object.values(qntBordersValuesNotZero).length === 1;
  }

  allBordersEqual(): boolean {
    return Object.keys(this.borderStyleValue).every(
      (key: borderKey) =>
        this.borderStyleValue[key] === this.borderStyleValue.topLeft
    );
  }

  addBorder(direction: borderKey, borderValue: number) {
    this.borderStyleValue[direction] = borderValue;
    this.updateBorderStyle();
    this.showBorderStyle();
  }
  showBorderStyle() {
    let styles = '';
    this.interatorBorderStyleData((property: string, value: string) => {
      styles += `<span>${property}:${value};</span>`;
    });

    this.borderBox.querySelector('.box-radius-content').innerHTML = styles;
    this.borderBox.querySelector(
      '.box-radius-content-mobile'
    ).innerHTML = styles;
  }

  updateBorderStyle() {
    let styles = '';
    this.interatorBorderStyleData((property: string, value: string) => {
      styles += `${property}:${value}; `;
    });
    if (this.isFirstBorderWithValue()) {
      let value = this.getBorderValueNotVoid();
      this.borderStyleValue.topLeft = value;
      this.borderStyleValue.topRight = value;
      this.borderStyleValue.bottomLeft = value;
      this.borderStyleValue.bottomRight = value;
      this.borderBox
        .querySelectorAll('input')
        .forEach((element: HTMLInputElement) => {
          element.setAttribute('value', String(value));
        });
    }
    this.borderBox.querySelector('.box-radius').setAttribute('style', styles);
  }

  handleChangeBorderRadius(event: Event) {
    const inputElement = <HTMLInputElement>event.target;
    const direction = <borderKey>inputElement.getAttribute('direction');
    const value = Number(inputElement.value);
    this.addBorder(direction, value);
  }
}
