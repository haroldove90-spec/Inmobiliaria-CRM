export type UserRole = 'admin' | 'agent' | 'coordinator' | 'compliance';
export type RoleType = UserRole;

export type AdminModule = 'analytics' | 'employees' | 'inventory_control' | 'sales_supervision';
export type AgentModule = 'pipeline' | 'inventory' | 'calendar' | 'closures';
export type CoordinatorModule = 'inbox' | 'distribution' | 'appointments';
export type ComplianceModule = 'nom247' | 'safety_stps';

export type ActiveModule = AdminModule | AgentModule | CoordinatorModule | ComplianceModule;

export type LeadSource = 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'call' | 'portal';
export type LeadInterest = 'comprador' | 'arrendatario' | 'propietario_captacion';
export type LeadStage = 'nuevo' | 'calificado' | 'visita' | 'propuesta' | 'cierre';

export interface Interaction {
  id: string;
  date: string;
  type: 'llamada' | 'whatsapp' | 'visita' | 'correo' | 'nota';
  note: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  interestType: LeadInterest;
  budgetMin: number;
  budgetMax: number;
  currency: 'MXN' | 'USD';
  preferredZone: string;
  bedrooms: number;
  stage: LeadStage;
  assignedAgentId?: string;
  notes: string;
  interactions: Interaction[];
  createdAt: string;
}

export type PropertyStatus = 'revision' | 'aprobada' | 'publicada' | 'rechazada' | 'apartada' | 'vendida';
export type OperationType = 'venta' | 'renta' | 'preventa';

export interface Property {
  id: string;
  code: string;
  title: string;
  operation: OperationType;
  propertyType: 'Casa' | 'Departamento' | 'Penthouse' | 'Terreno' | 'Oficina';
  price: number;
  currency: 'MXN' | 'USD';
  constructionM2: number;
  landM2: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  zone: string;
  city: string;
  address: string;
  description: string;
  features: string[];
  status: PropertyStatus;
  exclusiveContract: {
    folioProfeco: string;
    ownerName: string;
    ownerPhone: string;
    brokerageFeePercent: number;
    validUntil: string;
    signed: boolean;
  };
  assignedAgentId?: string;
  assignedAgentName?: string;
  imageUrl: string;
  depositHold?: {
    clientName: string;
    amountMxn: number;
    receiptRef: string;
    date: string;
    agentId: string;
  };
}

export interface Employee {
  id: string;
  name: string;
  roleTitle: string;
  roleType: 'admin' | 'agent' | 'coordinator';
  email: string;
  phone: string;
  avatar: string;
  activePortfolioCount: number;
  monthlySalesMxn: number;
  agreedCommissionPercent: number; // Porcentaje del asesor (ej. 50% de la comisión total de la agencia)
  officeSplitPercent: number; // Porcentaje retención oficina (ej. 50%)
  active: boolean;
  canViewAllPipelines: boolean;
}

export interface Deal {
  id: string;
  folio: string;
  propertyId: string;
  propertyTitle: string;
  propertyZone: string;
  agentId: string;
  agentName: string;
  clientName: string;
  clientPhone: string;
  saleAmountMxn: number;
  downPaymentMxn: number;
  reserveDepositMxn: number;
  notaryNumber: string;
  notaryCity: string;
  estimatedSigningDate: string;
  status: 'en_apartado' | 'dictamen_notarial' | 'firma_programada' | 'escriturada';
  totalCommissionMxn: number;
  agentCommissionEarnedMxn: number;
  commissionStatus: 'calculada' | 'aprobada' | 'pagada';
  lastUpdated: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  agentId: string;
  agentName: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  status: 'programada' | 'realizada' | 'cancelada';
  feedback?: {
    offerMxn?: number;
    objections?: string;
    nextStep?: string;
  };
}

export interface QuickTemplate {
  id: string;
  title: string;
  category: 'primer_contacto' | 'catalogo' | 'seguimiento' | 'objeciones';
  content: string;
}
