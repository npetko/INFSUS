package com.progi.AlfaBeta.putninalozi.testingController;

import com.progi.AlfaBeta.putninalozi.dao.ObracunRepository;
import com.progi.AlfaBeta.putninalozi.dao.TrosakRepository;
import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.dto.ObracunDto;
import com.progi.AlfaBeta.putninalozi.rest.ObracunController;
import com.progi.AlfaBeta.putninalozi.rest.TrosakController;
import com.progi.AlfaBeta.putninalozi.service.DrzavaService;
import com.progi.AlfaBeta.putninalozi.service.ObracunService;
import com.progi.AlfaBeta.putninalozi.service.TrosakService;
import com.progi.AlfaBeta.putninalozi.service.ZahtjevService;
import com.progi.AlfaBeta.putninalozi.service.impl.DrzavaServiceImpl;
import com.progi.AlfaBeta.putninalozi.service.impl.ObracunServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.BDDAssumptions.given;
import static org.hamcrest.MatcherAssert.assertThat;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ObracunControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ObracunRepository obracunRepository;

    @Mock
    private TrosakRepository trosakRepository;

    @InjectMocks
    private ObracunController obracunController;

    @InjectMocks
    private TrosakController trosakController;

    ObracunService obracunService;

    DrzavaService drzavaService;


    @BeforeEach
    public void setUp(){
        obracunService = new ObracunServiceImpl(obracunRepository);

    }

    @Test
    public void testObracun(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 12, 12, 23, 23);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 14, 12, 23, 23);

        Obracun obracun = new Obracun("2022-001", "sastanak", date1, date2);

        when(obracunRepository.save(any(Obracun.class))).thenReturn(obracun);

        Obracun spremljeniObracun = obracunRepository.save(obracun);

        assertNotNull(spremljeniObracun.getBrPutnogNaloga());
    }

    @Test
    public void testPretrazi(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 12, 12, 23, 23);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 14, 12, 23, 23);

        Obracun obracun = new Obracun("2022-001", "sastanak", date1, date2);

        when(obracunRepository.findByBrPutnogNaloga(obracun.getBrPutnogNaloga())).thenReturn(obracun);

        Obracun dohvaceniObracun = obracunService.findByBr(obracun.getBrPutnogNaloga());

        assertNotNull(dohvaceniObracun);
    }

    @Test
    public void dvijeValuteTest(){
        Trosak trosak1 = new Trosak("2022-001", "hlace", 20, "USD", true);
        Trosak trosak2 = new Trosak("2022-001", "majica", 10, "EUR", true);
        List<Trosak> troskovi = new ArrayList<>();
        troskovi.add(trosak1);
        troskovi.add(trosak2);

        LocalDateTime date1 = LocalDateTime.of(2022, 12, 13, 12, 23, 23);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 14, 12, 23, 23);

        Obracun obracun = new Obracun("2022-001", "sastanak", "", "", date1, date2);

        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 13);

        List<BoravakDrzava> boravci = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(85.65, obracunDto.getIzracun());
    }

    @Test
    public void koristenjeAutomobilaTest(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 13, 12, 23, 23);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 14, 12, 23, 23);

        Obracun obracun = new Obracun("2022-001", "sastanak", "ZG1234RI", "50", date1, date2);

        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 13);

        List<Trosak> troskovi = new ArrayList<>();
        List<BoravakDrzava> boravci = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(82, obracunDto.getIzracun());
    }

    @Test
    public void boravakManjiOdOsamTest(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 12, 12, 0, 0);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 12, 19, 59, 0);
        LocalDateTime date3 = LocalDateTime.of(2022, 12, 13, 12, 0, 0);
        LocalDateTime date4 = LocalDateTime.of(2022, 12, 13, 19, 59, 0);

        BoravakDrzava boravakDrzava1 = new BoravakDrzava("FRANCUSKA", "2022-001", date1, date2);
        BoravakDrzava boravakDrzava2 = new BoravakDrzava("SLOVENIJA", "2022-001", date3, date4);
        List<BoravakDrzava> boravci = new ArrayList<>();
        boravci.add(boravakDrzava1);
        boravci.add(boravakDrzava2);
        List<Trosak> troskovi = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");
        mapaBoravaka.put("SLOVENIJA", "50.00EUR");
        Obracun obracun = new Obracun("2022-001", "sastanak", "ZG1234RI", "0", date1, date2);
        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 0);

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(0, obracunDto.getIzracun());

    }

    @Test
    public void boravakOsamTest(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 12, 12, 0, 0);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 12, 20, 0, 0);
        LocalDateTime date3 = LocalDateTime.of(2022, 12, 13, 12, 0, 0);
        LocalDateTime date4 = LocalDateTime.of(2022, 12, 13, 20, 0, 0);

        BoravakDrzava boravakDrzava1 = new BoravakDrzava("FRANCUSKA", "2022-001", date1, date2);
        BoravakDrzava boravakDrzava2 = new BoravakDrzava("SLOVENIJA", "2022-001", date3, date4);
        List<BoravakDrzava> boravci = new ArrayList<>();
        boravci.add(boravakDrzava1);
        boravci.add(boravakDrzava2);
        List<Trosak> troskovi = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");
        mapaBoravaka.put("SLOVENIJA", "50.00EUR");
        Obracun obracun = new Obracun("2022-001", "sastanak", "ZG1234RI", "0", date1, date2);
        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 0);

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(60, obracunDto.getIzracun());
    }

    @Test
    public void boravakJedanaestDvanaestTest(){
        LocalDateTime date1 = LocalDateTime.of(2022, 12, 12, 10, 0, 0);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 12, 21, 59, 0);
        LocalDateTime date3 = LocalDateTime.of(2022, 12, 13, 10, 0, 0);
        LocalDateTime date4 = LocalDateTime.of(2022, 12, 13, 22, 0, 0);

        BoravakDrzava boravakDrzava1 = new BoravakDrzava("FRANCUSKA", "2022-001", date1, date2);
        BoravakDrzava boravakDrzava2 = new BoravakDrzava("SLOVENIJA", "2022-001", date3, date4);
        List<BoravakDrzava> boravci = new ArrayList<>();
        boravci.add(boravakDrzava1);
        boravci.add(boravakDrzava2);
        List<Trosak> troskovi = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");
        mapaBoravaka.put("SLOVENIJA", "50.00EUR");
        Obracun obracun = new Obracun("2022-001", "sastanak", "ZG1234RI", "0", date1, date2);
        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 0);

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(85, obracunDto.getIzracun());
    }

    @Test
    public void trosakRefundTest(){
        Trosak trosak1 = new Trosak("2022-001", "avionski trosak", 20, "USD", false);
        Trosak trosak2 = new Trosak("2022-001", "majica", 10, "EUR", true);
        List<Trosak> troskovi = new ArrayList<>();
        troskovi.add(trosak1);
        troskovi.add(trosak2);

        LocalDateTime date1 = LocalDateTime.of(2022, 12, 13, 12, 23, 23);
        LocalDateTime date2 = LocalDateTime.of(2022, 12, 14, 12, 23, 23);

        Obracun obracun = new Obracun("2022-001", "sastanak", "", "", date1, date2);

        Zahtjev zahtjev = new Zahtjev("2022-001", date1, date2, "FRANCUSKA", 0);

        List<BoravakDrzava> boravci = new ArrayList<>();
        Map<String, String> mapaBoravaka = new HashMap<>();
        mapaBoravaka.put("FRANCUSKA", "70.00EUR");

        ObracunDto obracunDto = obracunService.obracunajNalog(obracun, zahtjev, troskovi, boravci, mapaBoravaka);

        assertEquals(80, obracunDto.getIzracun());
    }



}
