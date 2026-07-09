package com.assessmentportal.controller;

import com.assessmentportal.model.Certificate;
import com.assessmentportal.repository.CertificateRepository;
import com.assessmentportal.service.CertificatePdfService;
import com.assessmentportal.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final CertificateRepository certificateRepository;
    private final CertificatePdfService certificatePdfService;

    public CertificateController(CertificateService certificateService,
                                 CertificateRepository certificateRepository,
                                 CertificatePdfService certificatePdfService) {
        this.certificateService = certificateService;
        this.certificateRepository = certificateRepository;
        this.certificatePdfService = certificatePdfService;
    }

    public static class GenerateRequest {
        private String studentId;
        private String assessmentId;

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public String getAssessmentId() { return assessmentId; }
        public void setAssessmentId(String assessmentId) { this.assessmentId = assessmentId; }
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody GenerateRequest request) {
        Optional<Certificate> optCert = certificateService.checkAndGenerate(request.getStudentId(), request.getAssessmentId());
        if (optCert.isPresent()) {
            return ResponseEntity.ok(optCert.get());
        }
        return ResponseEntity.badRequest().body("Certificate cannot be generated. Ensure submission exists, is graded, and score >= 90%.");
    }

    @GetMapping("/student/{studentId}")
    public List<Certificate> getByStudent(@PathVariable String studentId) {
        return certificateRepository.findByStudentId(studentId);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<?> getById(@PathVariable String certificateId) {
        Optional<Certificate> opt = certificateRepository.findById(certificateId);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/preview/{certificateId}")
    public ResponseEntity<byte[]> preview(@PathVariable String certificateId) {
        Optional<Certificate> opt = certificateRepository.findById(certificateId);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Certificate cert = opt.get();
            byte[] pdfBytes = certificatePdfService.generatePdf(cert);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"certificate_" + certificateId + ".pdf\"");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/download/{certificateId}")
    public ResponseEntity<byte[]> download(@PathVariable String certificateId) {
        Optional<Certificate> opt = certificateRepository.findById(certificateId);
        if (!opt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Certificate cert = opt.get();
            cert.setDownloadCount(cert.getDownloadCount() + 1);
            certificateRepository.save(cert);

            byte[] pdfBytes = certificatePdfService.generatePdf(cert);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "certificate_" + certificateId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
