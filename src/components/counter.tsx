'use client';

import React, {useState} from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>Hello this is home {count}
            <button onClick={()=> setCount(count+1)}>Change</button>
        </div>
    )
}

export default Counter;