declare module 'roughjs/bundled/rough.esm' {
    import roughjs from 'roughjs';
    export default roughjs;
}

declare module 'roughjs/bundled/rough.cjs' {
    export default roughjs;
}

declare module 'd-path-parser' {
    export = parse;

    function parse(d: string): parse.Command[];

    namespace parse {
        export interface Point {
            x: number;
            y: number;
        }

        export type Command =
            | {
                  code: 'M' | 'L';
                  relative: false;
                  end: Point;
              }
            | {
                  code: 'm' | 'l';
                  relative: true;
                  end: Point;
              }
            | { code: 'H' | 'V'; relative: false; value: number }
            | { code: 'h' | 'v'; relative: true; value: number }
            | {
                  code: 'C';
                  relative: false;
                  cp1: Point;
                  cp2: Point;
                  end: Point;
              }
            | {
                  code: 'c';
                  relative: true;
                  cp1: Point;
                  cp2: Point;
                  end: Point;
              }
            | {
                  code: 'S' | 'Q';
                  relative: false;
                  cp: Point;
                  end: Point;
              }
            | {
                  code: 's' | 'q';
                  relative: true;
                  cp: Point;
                  end: Point;
              }
            | {
                  code: 'T';
                  relative: false;
                  end: Point;
              }
            | {
                  code: 'T';
                  relative: true;
                  end: Point;
              }
            | {
                  code: 'A';
                  relative: false;
                  radii: Point;
                  rotation: number;
                  large: boolean;
                  clockwise: boolean;
                  end: Point;
              }
            | {
                  code: 'a';
                  relative: true;
                  radii: Point;
                  rotation: number;
                  large: boolean;
                  clockwise: boolean;
                  end: Point;
              }
            | {
                  code: 'Z';
              };
    }
}
