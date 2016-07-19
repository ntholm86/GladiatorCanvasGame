module GameInterfaces {
    export interface IField {
        Xpos: number;
        Ypos: number;
        Object: IBoardObject;
        FillColor: string;
    }

    export interface IBoardObject {
        Color: string;
        SelectedColor: string;
        HoverColor: string;
        InterActive: boolean;
    }
}