import * as React from "react";
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/quickstarts/dist/quickstarts.min.css';
import {
  QuickStartCatalogPage,
  QuickStartContext,
  QuickStartDrawer,
  useLocalStorage,
  useValuesForQuickStartContext,
} from "@patternfly/quickstarts";
import { Base64 } from "js-base64";

export const QuickStartsPreview = ({
  initialData: config,
  filePath,
  vscode,
}) => {
  const decodedConfig = Base64.decode(config);
  const allQuickStarts = [];
  allQuickStarts.push(JSON.parse(decodedConfig));
  const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
    "quickstartId",
    ""
  );
  const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
    "quickstarts",
    {}
  );
  const valuesForQuickstartContext = useValuesForQuickStartContext({
    allQuickStarts,
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
  });
  return (
    <QuickStartContext.Provider value={valuesForQuickstartContext}>
      <QuickStartDrawer>
        <QuickStartCatalogPage />
      </QuickStartDrawer>
    </QuickStartContext.Provider>
  );
};
