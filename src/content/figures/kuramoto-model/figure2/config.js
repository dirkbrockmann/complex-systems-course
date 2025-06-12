export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 300,
        height: 300,
        class: "p-0  mb-0 w-full h-auto "
    },
    controls: {
        width: 300,
        height: 80,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 12,y: 6}
    },
    plot: {
        margin: 20,
        L: 1,
        agentsize: 5
    },
    widgets: {
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 2,y: 3.5}
        },
        slider_size: 175,
        slider_girth: 8,
        slider_knob: 9,
        slider_gap: 1,
        slider_fontsize: 18,
        sliders: [
            {
                id: "omega",
                label: "\u03C9",
                range: [0.5,3],
                value: 1,
                position: {x: 4,y: 2}
            },
            {
                id: "A",
                label: "A",
                range: [0,8],
                value: 3,
                position: {x: 4,y: 5}
            },
        ]
    },

}
