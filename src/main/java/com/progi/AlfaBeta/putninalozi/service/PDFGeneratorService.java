package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface PDFGeneratorService {
    void exportZahtjev(Zahtjev zahtjev, HttpServletResponse response) throws IOException;

    void exportObracun(Obracun obracun, HttpServletResponse response) throws IOException;
}
