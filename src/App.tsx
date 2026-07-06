import { AnimatedBackground } from './components/Background/AnimatedBackground';
import { AppHeader } from './components/Header/AppHeader';
import { HistoryPanel } from './components/History/HistoryPanel';
import { JsonPreview } from './components/JsonPreview/JsonPreview';
import { LeadDataForm } from './components/LeadForm/LeadDataForm';
import { Templates } from './components/LeadForm/Templates';
import { WebhookEndpoint } from './components/LeadForm/WebhookEndpoint';
import { ResponsePanel } from './components/SendControls/ResponsePanel';
import { SendControls } from './components/SendControls/SendControls';
import { ToastViewport } from './components/Toast/ToastViewport';
import { useLeadTester } from './hooks/useLeadTester';

export function App() {
  const leadTester = useLeadTester();

  return (
    <>
      <AnimatedBackground />
      <main className="app">
        <AppHeader />
        <WebhookEndpoint
          value={leadTester.webhookUrl}
          hasErrorPulse={leadTester.urlErrorPulse}
          inputRef={leadTester.urlInputRef}
          onChange={leadTester.setWebhookUrl}
        />
        <Templates onSelect={leadTester.fillTemplate} />
        <LeadDataForm
          values={leadTester.values}
          meta={leadTester.meta}
          onChange={leadTester.updateField}
        />
        <JsonPreview
          payload={leadTester.payload}
          open={leadTester.jsonOpen}
          onToggle={() => leadTester.setJsonOpen((open) => !open)}
        />
        <SendControls
          sending={leadTester.sending}
          status={leadTester.status}
          onSend={() => void leadTester.send()}
          onClear={leadTester.clearForm}
        />
        <ResponsePanel response={leadTester.response} />
        <HistoryPanel history={leadTester.history} />
      </main>
      <ToastViewport toasts={leadTester.toasts} />
    </>
  );
}
