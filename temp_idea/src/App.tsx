import { useState } from 'react';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { TransactionsPage } from "./components/TransactionsPage";
import { BudgetsPage } from "./components/BudgetsPage";
import { ProfilePage } from "./components/ProfilePage";
import { InvestmentsPage } from "./components/InvestmentsPage";
import { WalletsPage } from "./components/WalletsPage";
import { ReportsPage } from "./components/ReportsPage";
import { GoalsPage } from "./components/GoalsPage";
import { SettingsPage } from "./components/SettingsPage";
import { RegisterPage } from "./components/RegisterPage";
import { DemoModeBanner } from "./components/DemoModeBanner";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { NewTransactionModal } from "./components/NewTransactionModal";

// Este es el contenido principal de la app (después de login)
function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string | undefined>(undefined);

  // Si no está autenticado, mostramos la página de login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Función para navegar con parámetros opcionales
  const handleNavigate = (page: string, options?: { tab?: string }) => {
    setCurrentPage(page);
    if (options?.tab) {
      setSettingsTab(options.tab);
    } else {
      setSettingsTab(undefined);
    }
  };

  // Función para renderizar la página actual
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'investments':
        return <InvestmentsPage />;
      case 'wallets':
        return <WalletsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'settings':
        return <SettingsPage defaultTab={settingsTab} />;
      case 'register':
        return <RegisterPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <DemoModeBanner />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header onNavigate={handleNavigate} />
        
        <div className="flex">
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={handleNavigate}
            onNewTransaction={() => setShowNewTransactionModal(true)}
            onUpgradePlan={() => handleNavigate('settings', { tab: 'billing' })}
          />
          
          {/* Contenido principal con animación */}
          <main className="flex-1 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      
      {/* Modal global de nueva transacción */}
      {showNewTransactionModal && (
        <NewTransactionModal 
          isOpen={showNewTransactionModal}
          onClose={() => setShowNewTransactionModal(false)}
        />
      )}
    </>
  );
}

// Componente principal que envuelve todo en el AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}