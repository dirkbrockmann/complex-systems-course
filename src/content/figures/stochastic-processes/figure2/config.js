export default {
    container: {
        class: "explorable flex flex-col items-center",
    },
    display: {
        width: 500,
        height: 500,
        class: "gront w-[50%] mb-0 h-auto",
        margin: {l: 20,r: 50,t: 20,b: 50},
        fontsize: "20px",
        xr: [-100,100],
        yr: [-100,100],
        xaxis: {
            label: "x",
            position: {x: 150,y: 190}
        },
        yaxis: {
            label: "y",
            position: {x: 175,y: 20}
        }
    },
    plot: {
        width: 500,
        height: 500,
        class: "mb-0 w-[50%] h-auto",
        margin: {l: 50,r: 30,t: 20,b: 50},
        fontsize: "20px",
        xr: [0,1000],
        yr: [0,40],
        xaxis: {
            label: "t",
            position: {x: 150,y: 190}
        },
        yaxis: {
            label: "r(t)",
            position: {x: 175,y: 20}
        }
    },
    controls: {
        width: 200,
        height: 100,
        class: "d3-widgets p-0 mb-0 h-auto",
        grid: {x: 6,y: 6}
    },
    widgets: {
        buttons: [
            {
                id: "play_pause",
                actions: ["play","pause"],
                value: 0,
                position: {x: 1,y: 3}
            },
            {
                id: "reset",
                actions: ["rewind"],
                value: 0,
                position: {x: 5,y: 3}
            },
        ]
    }
}
