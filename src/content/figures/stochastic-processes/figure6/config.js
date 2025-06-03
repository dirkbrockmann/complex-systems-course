export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 600,
        height: 300,
        class: "p-0  mb-0 w-full h-auto ",
    },
    controls: {
        width: 600,
        height: 170,
        class: "d3-widgets p-0  mb-0 w-full h-auto ",
        grid: {x: 12,y: 12}
    },
    widgets: {
        slider_size: 500,
        slider_girth: 10,
        slider_knob: 12,
        slider_fontsize: 18,
        sliders: [
            {
                id: "sigma",
                label: "noise strength",
                range: [0,0.25],
                value: 0.005,
                position: {x: 1,y: 2.5}
            },
            {
                id: "k",
                label: "force strength",
                range: [-3,3],
                value: 1,
                position: {x: 1,y: 6}
            },
        ],
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 4,y: 9.5}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 8,y: 9.5}
            },
        ]
    },
    plot: {
        margin: {l: 30,r: 30,t: 10,b: 30},
        xr: [0,10],
        yr: [-2,2],
        xaxis: {
            label: "t",
            label_position: {x: 280,y: 190},
            fontsize: "16px"
        },
        yaxis: {
            label: "X(t)",
            label_position: {x: 175,y: 20},
            fontsize: "16px"
        }
    }
}
