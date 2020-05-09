import * as React from 'react';

import TopRow from './TopRow/TopRow';
import MiddleRow from './MiddleRow/MiddleRow';
import BottomRow from './BottomRow/BottomRow';
import * as styles from './App.css';

const App: React.FC = () => {
  const thing = 5;

  return (
    <div className={styles.gridContainer}>
      <TopRow />
      <MiddleRow />
      <BottomRow />
    </div>
  );
};

export default App;
