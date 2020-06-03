import * as React from 'react';
import { useSelector } from 'react-redux';
import * as styles from './MiddleRow.css';
import { RootState } from '../../redux/reducer';
import ModuleArray from '../../types/Module';

const MiddleRow: React.FC = () => {
  const { modulesArray, currentModule } = useSelector<RootState, ModuleArray>(
    (state) => state.modules,
  );

  // The currently displayed module
  const [currentView, setCurrentView] = React.useState(null);

  React.useEffect(() => {
    if (currentModule) {
      const currComp = <currentModule.component key={currentModule.name} />;

      // Not sure why we have to resolve this but whatever
      Promise.resolve(currComp).then(setCurrentView);
    }
  }, [modulesArray, currentModule]);

  return (
    <div id={styles.middleRow}>
      {/* TODO: Maybe add a better no modules thing? */}
      {currentView ?? 'No modules enabled!'}
    </div>
  );
};

export default MiddleRow;
