declare module 'react-slick' {
    import { Component } from 'react';

    export interface Settings {
        dots?: boolean;
        infinite?: boolean;
        speed?: number;
        slidesToShow?: number;
        slidesToScroll?: number;
        autoplay?: boolean;
        autoplaySpeed?: number;
        nextArrow?: JSX.Element;
        prevArrow?: JSX.Element;
        [key: string]: any;
    }

    export default class Slider extends Component<Settings> { }
}
