export default {
    container: {
        class: "flex flex-col",
    },
    display: {
        width: 300,
        height: 200,
        class: "p-0  mb-0 w-full h-auto"
    },
    controls: {
        width: 300,
        height: 100,
        class: "d3-widgets p-0  mb-0 w-full h-auto",
        grid: {x: 12,y: 6}
    },
    widgets: {
        slider_size: 250,
        slider_girth: 8,
        slider_knob: 9,
        slider_gap: 1,
        slider_fontsize: 24,
        sliders: [
            {
                id: "mu",
                label: "\u03BC",
                range: [-5,5],
                value: 0,
                position: {x: 1,y: 2}
            },
            {
                id: "sigma",
                label: "\u03C3",
                range: [0.1,5],
                value: 1.0,
                position: {x: 1,y: 5}
            },
        ]
    },
    plot: {
        margin: {l: 30,r: 30,t: 10,b: 50},
        xr: [-10,10],
        yr: [0,0.5],
        xaxis: {
            label: "x",
            position: {x: 150,y: 190}
        },
        yaxis: {
            label: "p(x)",
            position: {x: 175,y: 20}
        }
    }
}
