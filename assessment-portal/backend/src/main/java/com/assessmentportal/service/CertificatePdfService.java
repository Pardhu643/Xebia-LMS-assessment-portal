package com.assessmentportal.service;

import com.assessmentportal.model.Certificate;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.awt.Color;

@Service
public class CertificatePdfService {

    public byte[] generatePdf(Certificate cert) throws DocumentException, IOException {
        // Create document in Landscape mode
        Document document = new Document(PageSize.A4.rotate(), 36, 36, 36, 36);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        
        document.open();

        // 1. Draw direct canvas borders and decorations
        PdfContentByte canvas = writer.getDirectContent();
        
        // Draw outer purple border
        canvas.setColorStroke(new Color(0x6C, 0x1D, 0x5F)); // Xebia Purple
        canvas.setLineWidth(5);
        canvas.rectangle(30, 30, PageSize.A4.rotate().getWidth() - 60, PageSize.A4.rotate().getHeight() - 60);
        canvas.stroke();

        // Draw inner thin gold/purple border
        canvas.setColorStroke(new Color(0x84, 0x11, 0x7C)); 
        canvas.setLineWidth(1.5f);
        canvas.rectangle(38, 38, PageSize.A4.rotate().getWidth() - 76, PageSize.A4.rotate().getHeight() - 76);
        canvas.stroke();

        // 2. Add Xebia logo top-left
        String logoPath = Paths.get("../public/images/xebia-logo.png").toAbsolutePath().toString();
        // Fallback check if running from different backend working directory
        if (!new File(logoPath).exists()) {
            logoPath = Paths.get("src/main/resources/static/images/xebia-logo.png").toAbsolutePath().toString();
        }
        if (!new File(logoPath).exists()) {
            logoPath = Paths.get("./public/images/xebia-logo.png").toAbsolutePath().toString();
        }
        if (!new File(logoPath).exists()) {
            logoPath = Paths.get("../assessment-portal/public/images/xebia-logo.png").toAbsolutePath().toString();
        }

        File logoFile = new File(logoPath);
        if (logoFile.exists()) {
            Image img = Image.getInstance(logoPath);
            img.scalePercent(12); 
            img.setAbsolutePosition(55, PageSize.A4.rotate().getHeight() - 95);
            document.add(img);
        }

        // 3. Add Content Layout
        Paragraph spacing = new Paragraph(" ");
        spacing.setSpacingBefore(55);
        document.add(spacing);

        // Certificate of Completion Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, Font.BOLD, new Color(0x6C, 0x1D, 0x5F));
        Paragraph title = new Paragraph("Certificate of Completion", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Subtitle
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.NORMAL, new Color(0x4A, 0x55, 0x68));
        Paragraph subtitle = new Paragraph("This is to certify that", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(12);
        document.add(subtitle);

        // Student Name
        Font nameFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 32, Font.BOLD | Font.ITALIC, new Color(0x84, 0x11, 0x7C));
        Paragraph name = new Paragraph(cert.getStudentName(), nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingAfter(12);
        document.add(name);

        // Course completion text
        Paragraph desc = new Paragraph("has successfully completed the subject", subtitleFont);
        desc.setAlignment(Element.ALIGN_CENTER);
        desc.setSpacingAfter(10);
        document.add(desc);

        // Subject Name
        String subject = cert.getSubject() != null && !cert.getSubject().isEmpty() ? cert.getSubject() : cert.getAssessmentTitle();
        Font subjectFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 22, Font.BOLD, new Color(0x6C, 0x1D, 0x5F));
        Paragraph assTitle = new Paragraph(subject, subjectFont);
        assTitle.setAlignment(Element.ALIGN_CENTER);
        assTitle.setSpacingAfter(15);
        document.add(assTitle);

        // Score details
        String scoreText = String.format("with an overall score of %.2f%%", cert.getPercentage());
        Paragraph score = new Paragraph(scoreText, subtitleFont);
        score.setAlignment(Element.ALIGN_CENTER);
        score.setSpacingAfter(30);
        document.add(score);

        // Bottom Details (Signatures, Issue Date, ID)
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(90);
        table.setSpacingBefore(10);

        // Row 1 Column 1: Issue Date
        Paragraph col1Paragraph = new Paragraph();
        col1Paragraph.setAlignment(Element.ALIGN_CENTER);
        col1Paragraph.add(new Chunk("Issue Date\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD, new Color(0x6C, 0x1D, 0x5F))));
        col1Paragraph.add(new Chunk(cert.getIssueDate() + "\n", FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL, new Color(0x2D, 0x37, 0x48))));
        PdfPCell cell1 = new PdfPCell(col1Paragraph);
        cell1.setBorder(Rectangle.NO_BORDER);
        cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell1);

        // Row 1 Column 2: Issued by Xebia Academy
        Paragraph col2Paragraph = new Paragraph();
        col2Paragraph.setAlignment(Element.ALIGN_CENTER);
        col2Paragraph.add(new Chunk("Issued by\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD, new Color(0x6C, 0x1D, 0x5F))));
        col2Paragraph.add(new Chunk("Xebia Academy\n", FontFactory.getFont(FontFactory.HELVETICA, 10, Font.NORMAL, new Color(0x2D, 0x37, 0x48))));
        PdfPCell cell2 = new PdfPCell(col2Paragraph);
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell2);

        // Row 1 Column 3: Verification Certificate ID
        Paragraph col3Paragraph = new Paragraph();
        col3Paragraph.setAlignment(Element.ALIGN_CENTER);
        col3Paragraph.add(new Chunk("Certificate ID\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD, new Color(0x6C, 0x1D, 0x5F))));
        col3Paragraph.add(new Chunk(cert.getId(), FontFactory.getFont(FontFactory.HELVETICA, 8, Font.NORMAL, new Color(0x71, 0x80, 0x96))));
        PdfPCell cell3 = new PdfPCell(col3Paragraph);
        cell3.setBorder(Rectangle.NO_BORDER);
        cell3.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell3);

        // Row 2 Column 1: Empty
        PdfPCell cellEmpty1 = new PdfPCell(new Paragraph(""));
        cellEmpty1.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellEmpty1);

        // Row 2 Column 2: Gold Stamp
        String stampPath = Paths.get("../public/images/gold-stamp.png").toAbsolutePath().toString();
        if (!new File(stampPath).exists()) {
            stampPath = Paths.get("src/main/resources/static/images/gold-stamp.png").toAbsolutePath().toString();
        }
        if (!new File(stampPath).exists()) {
            stampPath = Paths.get("./public/images/gold-stamp.png").toAbsolutePath().toString();
        }
        if (!new File(stampPath).exists()) {
            stampPath = Paths.get("../assessment-portal/public/images/gold-stamp.png").toAbsolutePath().toString();
        }
        PdfPCell cellStamp = new PdfPCell();
        cellStamp.setBorder(Rectangle.NO_BORDER);
        cellStamp.setHorizontalAlignment(Element.ALIGN_CENTER);
        File stampFile = new File(stampPath);
        if (stampFile.exists()) {
            Image stampImg = Image.getInstance(stampPath);
            stampImg.scalePercent(18);
            stampImg.setAlignment(Element.ALIGN_CENTER);
            cellStamp.addElement(stampImg);
        } else {
            cellStamp.addElement(new Paragraph("\n"));
        }
        table.addCell(cellStamp);

        // Row 2 Column 3: Empty
        PdfPCell cellEmpty2 = new PdfPCell(new Paragraph(""));
        cellEmpty2.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellEmpty2);

        // Row 3 Column 1: Empty
        PdfPCell cellEmpty3 = new PdfPCell(new Paragraph(""));
        cellEmpty3.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellEmpty3);

        // Row 3 Column 2: CEO Signature
        String sigPath = Paths.get("../public/images/ceo-signature.png").toAbsolutePath().toString();
        if (!new File(sigPath).exists()) {
            sigPath = Paths.get("src/main/resources/static/images/ceo-signature.png").toAbsolutePath().toString();
        }
        if (!new File(sigPath).exists()) {
            sigPath = Paths.get("./public/images/ceo-signature.png").toAbsolutePath().toString();
        }
        if (!new File(sigPath).exists()) {
            sigPath = Paths.get("../assessment-portal/public/images/ceo-signature.png").toAbsolutePath().toString();
        }
        PdfPCell cellSig = new PdfPCell();
        cellSig.setBorder(Rectangle.NO_BORDER);
        cellSig.setHorizontalAlignment(Element.ALIGN_CENTER);
        File sigFile = new File(sigPath);
        if (sigFile.exists()) {
            Image sigImg = Image.getInstance(sigPath);
            sigImg.scalePercent(16);
            sigImg.setAlignment(Element.ALIGN_CENTER);
            cellSig.addElement(sigImg);
        }
        Paragraph sigNamePara = new Paragraph();
        sigNamePara.setAlignment(Element.ALIGN_CENTER);
        sigNamePara.add(new Chunk("Anand Sahay\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Font.BOLD, new Color(0x2D, 0x37, 0x48))));
        sigNamePara.add(new Chunk("CEO, Xebia", FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, new Color(0x71, 0x80, 0x96))));
        cellSig.addElement(sigNamePara);
        table.addCell(cellSig);

        // Row 3 Column 3: Empty
        PdfPCell cellEmpty4 = new PdfPCell(new Paragraph(""));
        cellEmpty4.setBorder(Rectangle.NO_BORDER);
        table.addCell(cellEmpty4);

        document.add(table);

        document.close();
        return baos.toByteArray();
    }
}
