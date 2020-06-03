import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './ModuleSwitcher.css';
import * as mediaControlStyles from '../MediaControl/MediaControl.css';
import { RootState } from '../../../redux/reducer';
import { changeCurrentModule } from '../../../redux/actions/modules';
import { Module } from '../../../types/Module';

/**
 * Handles switching between the modules that are being shown in MiddleRow
 */
const ModuleSwitcher: React.FC = () => {
  // Get all of the active modules' pictures from Redux
  const modulesArray = useSelector<RootState, Module[]>((state) => state.modules.modulesArray);
  const dispatch = useDispatch();

  let moduleButtons: JSX.Element[] = [];

  // TODO: This should update anytime modulesArray changes
  function addModuleButtons(): void {
    moduleButtons = []; // Clear module buttons so we don't add duplicates

    // Clear moduleButtons, probably
    modulesArray.forEach((module) => {
      const element = (
        <button
          type="button"
          onClick={(): void => {
            dispatch(changeCurrentModule(module));
          }}
          key={module.name}
          className={mediaControlStyles.imageButton}
          data-testid={`${module.name}-button`}
        >
          <img src={module.icon} alt="" className={styles.toggleButton} />
        </button>
      );

      moduleButtons.push(element);
    });
  }

  addModuleButtons();

  return (
    <div id={styles.viewSwapper}>
      <div id={styles.controlContainer}>
        {moduleButtons}
      </div>
    </div>
  );
};

export default ModuleSwitcher;
