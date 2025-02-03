import { useRef, useState, useEffect } from 'react';
import { useSprings, animated, config, to as interpolate} from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import clamp from 'lodash.clamp';
import swap from 'lodash-move';

import '../App.css';

import styles from '../styles.module.css';

interface DraggableListProps {
    items: string[];
    onOrderChange: (isCorrect: boolean) => void;
    targetWord: string;
}

const DraggableList: React.FC<DraggableListProps> = ({ items, onOrderChange, targetWord }) => {
    const order = useRef(items.map((_, index) => index));
    const [spacing, setSpacing] = useState(80); // Initial SPACING value

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newSpacing;
            newSpacing = Math.min(120, width / 8);
            setSpacing(newSpacing);
        };
      
    
        window.addEventListener('resize', handleResize);
        handleResize(); // Call on mount to set initial value
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    

    const fn =
    (order: number[], active = false, originalIndex = 0, curIndex = 0, x = 0) =>
    (index: number) =>
        active && index === originalIndex
            ? {
                  x: curIndex * spacing + x, // Changed from y to x
                  scale: 1.1,
                  zIndex: 1,
                  shadow: 15,
                  immediate: (key: string) => key === 'zIndex',
                  config: (key: string) => (key === 'x' ? config.stiff : config.default), // Changed from y to x
              }
            : {
                  x: order.indexOf(index) * spacing, // Changed from y to x
                  scale: 1,
                  zIndex: 0,
                  shadow: 1,
                  immediate: false,
              };



    const checkOrder = (): boolean => {
        const currentString = order.current.map(index => items[index]).join('');
        return currentString === targetWord;
      };

    // Define the function to calculate spring properties
    const calculateSprings = (order: number[], spacing: number) => (index: number) => ({
        x: order.indexOf(index) * spacing,
        scale: 1,
        zIndex: 0,
        shadow: 1,
        immediate: false
    });

    const [springs, api] = useSprings(items.length, index => calculateSprings(order.current, spacing)(index));

    // Update springs when spacing changes
    useEffect(() => {
        api.start(index => calculateSprings(order.current, spacing)(index));
    }, [spacing, api]);

    const bind = useDrag(({ args: [originalIndex], active, movement: [x, ], first, last }) => { // Changed movement destructuring to x
        const curIndex = order.current.indexOf(originalIndex);
        const curColumn = clamp(Math.round((curIndex * spacing + x) / spacing), 0, items.length - 1); // Changed from y to x and row to column
        const newOrder = swap(order.current, curIndex, curColumn);
        api.start(fn(newOrder, active, originalIndex, curIndex, x)); // Changed y to x
        if (!active) {
            order.current = newOrder;
            const orderIsCorrect = checkOrder();
            onOrderChange(orderIsCorrect);  // Callback right after setting new order
        }

        if (last) {
            console.log('Drag released!');
            const orderIsCorrect = checkOrder();
            onOrderChange(orderIsCorrect);  // Callback right after setting new order
        }
    });

    return (

        <div className="DraggableList-container">  {/* Ensure this className matches what you style */}    
            <div className={styles.content} style={{ width: items.length * spacing }}>
                {springs.map(({ zIndex, shadow, x, scale }, i) => (
                    <animated.div
                        {...bind(i)}
                        key={i}
                        style={{
                            zIndex,
                            // boxShadow: shadow.to(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                            x,
                            scale,
                        }}
                        children={items[i]}
                    />
                ))}
            </div>
        </div>
    );
}

export default DraggableList;
