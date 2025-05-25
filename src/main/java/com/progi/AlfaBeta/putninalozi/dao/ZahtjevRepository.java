package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import com.progi.AlfaBeta.putninalozi.dto.ZahtjevDto;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public interface ZahtjevRepository extends JpaRepository<Zahtjev,String> {
    public List<Zahtjev> findByKorisnickoIme(String korisnickoIme);

    public Zahtjev findByBrPutnogNaloga(String brPutnogNaloga);
    public void deleteByBrPutnogNaloga(String brPutnogNaloga);
}
