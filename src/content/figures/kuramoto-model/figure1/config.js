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
        grid: {x: 12,y: 6},
        button: {
            id: "play_pause",
            actions: ["play","pause"],
            value: 0,
            position: {x: 6,y: 3}
        }
    },
    plot: {
        margin: 20,
        L: 1,
        agentsize: 5
    }
}
