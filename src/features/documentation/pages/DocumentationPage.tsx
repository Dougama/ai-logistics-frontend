import React, { useState, useEffect } from "react";
import { TextInput, LoadingOverlay } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { DocumentCategories } from "../components/DocumentCategories";
import { PdfViewer } from "../components/PdfViewer";
import { documentationService } from "../services";
import type { DocumentsByCategory, Document } from "../types";

// Import styles
import "../../../styles/components/dashboard.css";

export const DocumentationPage: React.FC = () => {
  const [documentCategories, setDocumentCategories] = useState<
    DocumentsByCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const categories = await documentationService.getDocumentsByCategory();
      setDocumentCategories(categories);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleCloseViewer = () => {
    setSelectedDocument(null);
  };


  // Filtrar documentos basado en la búsqueda
  const filteredCategories = documentCategories.map((category) => ({
    ...category,
    documents: category.documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="documentation-page">
      <LoadingOverlay visible={loading} />
      
      <div className="documentation-header">
        <h1 className="documentation-main-title">Documentación</h1>
        <p className="documentation-main-subtitle">Accede a manuales y guías organizados por categoría</p>
      </div>

      <div className="documentation-search">
        <TextInput
          placeholder="Buscar documentos..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="documentation-search-input"
        />
      </div>

      <DocumentCategories
        categories={filteredCategories}
        onViewDocument={handleViewDocument}
      />

      {/* PDF Viewer Modal */}
      {selectedDocument && (
        <PdfViewer
          url={selectedDocument.pdfUrl}
          title={selectedDocument.title}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};
