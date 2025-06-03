export default {
    container: {
        class: "flex flex-col ",
    },
    display: {
        width: 300,
        height: 200,
        class: "p-0  mb-0 w-full h-auto",
    },
    controls: {
        width: 300,
        height: 60,
        class: "d3-widgets p-0  mb-0 w-full h-auto",
        grid: {x: 8,y: 4}
    },
    widgets: {
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 2,y: 2}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 6,y: 2}
            },
        ]
    },
    plot: {
        margin: {l: 30,r: 30,t: 10,b: 30},
        xr: [-10,10],
        yr: [0,0.5],
        xaxis: {
            label: "x",
            label_position: {x: 280,y: 190},
            fontsize: "20px"
        },
        yaxis: {
            label: "p(x,t)",
            label_position: {x: 175,y: 20},
            fontsize: "20px"
        }
    }
}
