import React, { useState, useEffect } from 'react';
import { RoleType, Property, Employee, Lead, Deal, Appointment, PropertyStatus } from './types';
import {
  initialProperties,
  initialEmployees,
  initialLeads,
  initialDeals,
  initialAppointments,
} from './data/initialData';
import { RoleSelectorHome } from './components/RoleSelectorHome';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { InstallModal } from './components/InstallModal';
import { usePWAInstall } from './hooks/usePWAInstall';

// Admin modules
import { ExecutiveAnalytics } from './components/admin/ExecutiveAnalytics';
import { EmployeesCommissions } from './components/admin/EmployeesCommissions';
import { InventoryApproval } from './components/admin/InventoryApproval';
import { SalesSupervision } from './components/admin/SalesSupervision';

// Agent modules
import { AgentPipelineKanban } from './components/agent/AgentPipelineKanban';
import { AgentInventory } from './components/agent/AgentInventory';
import { AgentCalendar } from './components/agent/AgentCalendar';
import { AgentClosuresCommissions } from './components/agent/AgentClosuresCommissions';

// Coordinator modules
import { OmnichannelInbox } from './components/coordinator/OmnichannelInbox';
import { LeadDistribution } from './components/coordinator/LeadDistribution';
import { AppointmentsTemplates } from './components/coordinator/AppointmentsTemplates';

// Compliance module
import { ComplianceAuditor } from './components/compliance/ComplianceAuditor';

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleType | null>(() => {
    const saved = localStorage.getItem('inmo_role');
    return (saved as RoleType) || null;
  });

  const [activeModule, setActiveModule] = useState<string>('analytics');

  // Application Data State
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('inmo_properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('inmo_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('inmo_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('inmo_deals');
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('inmo_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Cross-module selected lead for distribution
  const [selectedLeadForDistribution, setSelectedLeadForDistribution] = useState<Lead | null>(null);

  // PWA Install Prompt Hook
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Sync state to local storage for persistence across refreshes
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('inmo_role', currentRole);
    } else {
      localStorage.removeItem('inmo_role');
    }
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('inmo_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('inmo_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('inmo_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('inmo_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('inmo_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handle Role Selection from Home
  const handleSelectRole = (role: RoleType) => {
    setCurrentRole(role);
    if (role === 'admin') setActiveModule('analytics');
    else if (role === 'agent') setActiveModule('pipeline');
    else if (role === 'coordinator') setActiveModule('inbox');
    else if (role === 'compliance') setActiveModule('compliance');
  };

  // Handle Logout (return to role selector)
  const handleLogout = () => {
    setCurrentRole(null);
  };

  // Handlers for Data Mutations
  const handleUpdatePropertyStatus = (propertyId: string, newStatus: PropertyStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus } : p))
    );
  };

  const handleReserveProperty = (
    propertyId: string,
    clientName: string,
    amount: number,
    receiptRef: string
  ) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              status: 'apartada',
              depositHold: {
                clientName,
                amountMxn: amount,
                receiptRef,
                date: new Date().toISOString().split('T')[0],
              },
            }
          : p
      )
    );
  };

  const handleUpdateCommission = (employeeId: string, newRate: number) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, agreedCommissionPercent: newRate } : e))
    );
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleAssignLead = (leadId: string, agentId: string) => {
    const agent = employees.find((e) => e.id === agentId);
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedAgentId: agentId,
              stage: l.stage === 'nuevo' ? 'calificado' : l.stage,
              interactions: [
                ...l.interactions,
                {
                  id: `int-${Date.now()}`,
                  date: new Date().toISOString().split('T')[0],
                  type: 'nota',
                  note: `Asignado al asesor ${agent ? agent.name : agentId} para atención inmediata.`,
                  author: 'Coordinador de Leads',
                },
              ],
            }
          : l
      )
    );
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updatedApt.id ? updatedApt : a)));
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  // Switch to distribution screen with specific lead pre-selected
  const handleSelectLeadForDistribution = (lead: Lead) => {
    setSelectedLeadForDistribution(lead);
    setActiveModule('distribution');
  };

  // Quick action for PWA install button
  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowInstallGuide(true);
    }
  };

  // Render current role module
  const renderCurrentModule = () => {
    if (!currentRole) return null;

    if (currentRole === 'admin') {
      switch (activeModule) {
        case 'analytics':
          return (
            <ExecutiveAnalytics
              properties={properties}
              employees={employees}
              deals={deals}
              leads={leads}
            />
          );
        case 'employees':
          return (
            <EmployeesCommissions
              employees={employees}
              deals={deals}
              onUpdateCommission={handleUpdateCommission}
            />
          );
        case 'inventory':
          return (
            <InventoryApproval
              properties={properties}
              onUpdatePropertyStatus={handleUpdatePropertyStatus}
            />
          );
        case 'sales':
          return (
            <SalesSupervision
              deals={deals}
              employees={employees}
              onUpdateDeal={handleUpdateDeal}
              onAddDeal={handleAddDeal}
            />
          );
        default:
          return (
            <ExecutiveAnalytics
              properties={properties}
              employees={employees}
              deals={deals}
              leads={leads}
            />
          );
      }
    }

    if (currentRole === 'agent') {
      const currentAgentId = 'emp-2'; // Arq. Sofía Mendoza
      switch (activeModule) {
        case 'pipeline':
          return (
            <AgentPipelineKanban
              leads={leads}
              currentAgentId={currentAgentId}
              onUpdateLead={handleUpdateLead}
              onAddLead={handleAddLead}
            />
          );
        case 'catalog':
          return (
            <AgentInventory
              properties={properties.filter((p) => p.status === 'publicada' || p.status === 'apartada')}
              onReserveProperty={handleReserveProperty}
            />
          );
        case 'agenda':
          return (
            <AgentCalendar
              appointments={appointments}
              properties={properties}
              leads={leads}
              onUpdateAppointment={handleUpdateAppointment}
              onAddAppointment={handleAddAppointment}
            />
          );
        case 'closures':
          return (
            <AgentClosuresCommissions
              deals={deals}
              currentAgentId={currentAgentId}
            />
          );
        default:
          return (
            <AgentPipelineKanban
              leads={leads}
              currentAgentId={currentAgentId}
              onUpdateLead={handleUpdateLead}
              onAddLead={handleAddLead}
            />
          );
      }
    }

    if (currentRole === 'coordinator') {
      switch (activeModule) {
        case 'inbox':
          return (
            <OmnichannelInbox
              leads={leads}
              onAddLead={handleAddLead}
              onSelectLeadForDistribution={handleSelectLeadForDistribution}
            />
          );
        case 'distribution':
          return (
            <LeadDistribution
              leads={leads}
              employees={employees}
              onAssignLead={handleAssignLead}
              selectedLeadForDistribution={selectedLeadForDistribution}
            />
          );
        case 'appointments':
          return (
            <AppointmentsTemplates
              leads={leads}
              properties={properties}
              employees={employees}
              onAddAppointment={handleAddAppointment}
            />
          );
        default:
          return (
            <OmnichannelInbox
              leads={leads}
              onAddLead={handleAddLead}
              onSelectLeadForDistribution={handleSelectLeadForDistribution}
            />
          );
      }
    }

    if (currentRole === 'compliance') {
      return (
        <ComplianceAuditor
          properties={properties}
          employees={employees}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* If No Role Selected: Show clean 2-col (mobile) / 4-col (desktop) Role Selector Home */}
      {!currentRole ? (
        <RoleSelectorHome
          onSelectRole={handleSelectRole}
          onInstallApp={handleInstallClick}
        />
      ) : (
        /* Unified Role Workspace with Desktop Left Sidebar and Mobile Bottom Bar */
        <div className="flex flex-col min-h-screen">
          {/* Top Unified Header */}
          <Header
            currentRole={currentRole}
            onLogout={handleLogout}
            onInstallClick={handleInstallClick}
          />

          <div className="flex flex-1 relative overflow-hidden">
            {/* Desktop Left Sidebar */}
            <Sidebar
              currentRole={currentRole}
              activeModule={activeModule}
              onSelectModule={setActiveModule}
              onLogout={handleLogout}
            />

            {/* Main Content Workspace (Clean layout without redundant horizontal tabs) */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
              {renderCurrentModule()}
            </main>
          </div>

          {/* Mobile & Tablet Bottom Bar (Fixed, touch-optimized) */}
          <BottomBar
            currentRole={currentRole}
            activeModule={activeModule}
            onSelectModule={setActiveModule}
          />
        </div>
      )}

      {/* PWA Install Guide Modal */}
      {showInstallGuide && (
        <InstallModal
          onClose={() => setShowInstallGuide(false)}
          isIOS={isIOS}
        />
      )}
    </div>
  );
}
