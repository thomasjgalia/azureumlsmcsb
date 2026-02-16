// ============================================================================
// Type Definitions for UMLS Code Set Builder
// ============================================================================

// UMLS Search Result from API
export interface UMLSSearchResult {
  ui: string;              // Unique identifier (CUI)
  name: string;            // Concept name
  rootSource: string;      // Root source vocabulary
  sources?: UMLSSource[];  // All vocabulary sources for this concept
  semanticTypes?: Array<{ name: string; uri: string }>;  // Semantic types (STY)
  atomCount?: number;      // Number of atoms (source codes) for this concept
  status?: string;         // Current status of the concept
}

export interface UMLSSource {
  code: string;
  vocabulary: string;
  term: string;
  sourceConcept: string;
}

// UMLS Hierarchy/Relationship data
export interface UMLSRelationship {
  cui: string;
  name: string;
  relationshipLabel: string;  // e.g., "PAR" (parent), "CHD" (child)
  additionalRelationLabel?: string;
}

// UMLS Hierarchy Node (for ancestors/descendants)
export interface UMLSHierarchyNode {
  ui: string;              // AUI
  name: string;            // Term
  code?: string;           // Source code
  rootSource: string;      // Vocabulary
  relationLabel?: string;  // Relationship type (e.g., "PAR", "CHD")
}

// API Request/Response Types
export interface SearchUMLSRequest {
  searchTerm: string;
  vocabularies?: string[];
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'alphabetical';
}

export interface SearchUMLSResponse {
  success: boolean;
  data: UMLSSearchResult[];
  pageNumber: number;
  pageSize: number;
  total: number;
}

