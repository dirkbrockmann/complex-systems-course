export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 600,
        height: 300,
        class: " p-0  mb-0 w-full h-auto"
    },
    controls: {
        width: 600,
        height: 120,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 12,y: 6}
    },
    plot: {
        arrow_scale: 1,
        number_of_arrows: 10,
        fixpointradius: 8,
        margin: {l: 40,r: 10,t: 10,b: 10},
        xr: [0,2 * Math.PI],
        yr: [-1,1],
        xaxis: {
            label: "x",
            label_position: {x: 280,y: 190}
        },
        yaxis: {
            label: "f(x)",
            label_position: {x: 175,y: 20}
        }
    },
    widgets: {
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 2,y: 3}
        },
        slider_size: 500,
        slider_girth: 8,
        slider_knob: 9,
        slider_gap: 1,
        slider_fontsize: 14,
        sliders: [
            {
                id: "omega",
                label: "\u03B4\u03C9",
                range: [0,1],
                value: 0.25,
                position: {x: 1,y: 2},
                show: true
            },
            {
                id: "K",
                label: "K",
                range: [0,1],
                value: 0.5,
                position: {x: 1,y: 5},
                show: true
            },
        ]
    },

}
