import { BorderRadiusGenerate } from './border-radius.service';

describe('Default teste', () => {
  let service: BorderRadiusGenerate;
  const inputElement = {
    value: 10,
    addEventListener: () => {},
  };
  const inputElement2 = {
    value: 16,
    addEventListener: () => {},
  };
  const domSpy: any = {
    innerHTML: '',
    setAttribute: () => {},
    addEventListener: () => {},
    querySelector: (s: string) => ({
      innerHTML: domSpy.innerHTML,
      addEventListener: domSpy.addEventListener,
      setAttribute: domSpy.setAttribute,
    }),
    querySelectorAll: () => [inputElement, inputElement2],
  };
  const domMock = jest.fn().mockImplementation(() => domSpy);

  beforeEach(() => {
    jest.spyOn(document, 'querySelector').mockImplementation(domMock);
    service = new BorderRadiusGenerate('.wrapper');
  });
  it('should instance BorderRadiusGenerate', () => {
    const spyInputEvent = jest.spyOn(inputElement, 'addEventListener');
    const spyInput2Event = jest.spyOn(inputElement2, 'addEventListener');
    const instance = new BorderRadiusGenerate('.wrapper');
    expect(instance['borderSelector']).toEqual('.wrapper');
    expect(spyInputEvent).toHaveBeenCalledWith('change', expect.any(Function));
    expect(spyInput2Event).toHaveBeenCalledWith('change', expect.any(Function));
  });
  it('inputBorderForEach should interator for each input element on border box radius element and have called callback', () => {
    const objSpy = {
      fnc: () => {},
    };
    const spyFnc = jest.spyOn(objSpy, 'fnc');
    service.inputBorderForEach(objSpy.fnc);
    expect(spyFnc).toHaveBeenCalledWith(inputElement);
    expect(spyFnc).toHaveBeenCalledWith(inputElement2);
  });

  it('getBorderValues should get value attribute in all input elements', () => {
    expect(service.getBorderValues()).toEqual([10, 16]);
  });

  it('haveOnlyOneBorderWithValue should be false because inputs value not equals', () => {
    jest.spyOn(service, 'getBorderValues').mockReturnValue([2, 0, 0, 1]);
    expect(service.haveOnlyOneBorderWithValue()).toBeFalsy();
  });

  it('haveOnlyOneBorderWithValue should be true because inputs values equals', () => {
    jest.spyOn(service, 'getBorderValues').mockReturnValue([0, 0, 0, 1]);
    expect(service.haveOnlyOneBorderWithValue()).toBeTruthy();
  });

  it('updateBorderValues have called setBordersValue with current values all input elements ', () => {
    const spyFnc = jest
      .spyOn(service, 'setBorderValues')
      .mockImplementationOnce(jest.fn());
    jest.spyOn(service, 'getBorderValues').mockReturnValue([10, 10, 10, 0]);

    service.updateBorderValues();
    expect(spyFnc).toHaveBeenLastCalledWith([10, 10, 10, 0]);
  });

  it('setBorderStyles should computed border radius style and html content of the box radius', () => {
    jest.spyOn(service, 'borderBox', 'get').mockReturnValueOnce(domSpy);
    const spyContent = jest.spyOn(service, 'getBorderStylesHtmlContent');
    const spySetAttribute = jest.spyOn(domSpy, 'setAttribute');
    const style = 'border-radius: 10px 10px 20px 20px';
    service.setBorderStyles([10, 10, 20, 20]);

    expect(spySetAttribute).toHaveBeenCalledWith('style', style);
    expect(spyContent).toHaveBeenCalledWith(style);
  });

  it('getBorderStylesHtmlContent should get compute style list on span without preffix', () => {
    const style = 'border-radius: 10px 10px 20px 20px';
    service['preffixBrowserSupportActive'].css3 = true;
    service['preffixBrowserSupportActive'].gecko = false;
    service['preffixBrowserSupportActive'].webKit = false;
    expect(service.getBorderStylesHtmlContent(style)).toEqual(
      `<span>border-radius: 10px 10px 20px 20px;</span>`
    );
  });

  it('getBorderStylesHtmlContent should get compute style list on span with preffix', () => {
    const style = 'border-radius: 10px 10px 20px 20px';
    service['preffixBrowserSupportActive'].css3 = true;
    service['preffixBrowserSupportActive'].gecko = true;
    service['preffixBrowserSupportActive'].webKit = true;
    expect(service.getBorderStylesHtmlContent(style)).toEqual(
      `<span>border-radius: 10px 10px 20px 20px;</span><span>-moz-border-radius: 10px 10px 20px 20px;</span><span>-webkit-border-radius: 10px 10px 20px 20px;</span>`
    );
  });
});
