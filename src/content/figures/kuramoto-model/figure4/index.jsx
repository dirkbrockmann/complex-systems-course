import {config,load} from '@explorables/ride_my_kuramotocycle';
import * as d3 from 'd3';
import {useEffect,useRef} from 'react';


config.container_class = "flex flex-col sm:flex-row items-start gap-8"; // flex col on mobile, row on sm+, gap for spacing
config.display_class = "w-full border-1 border-black dark:border-white sm:w-1/2 mb-0 h-auto"; // 2/3 width on sm+, full on mobile
config.controls_class = "w-full sm:w-1/2 mb-0 h-auto"; // 1/3 width on sm+, full on mobile


export default ({id}) => {
    const containerRef = useRef(null);

    useEffect(() => {

        if(containerRef.current) {
            load(containerRef.current.id);
        }
        return () => {
            d3.select('#' + containerRef.current.id).selectAll('*').remove(); // Clean up the container
        };
    },[id]);

    return <div ref={containerRef} id={id} />;
}