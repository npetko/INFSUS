package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ZaposlenikRepository extends JpaRepository<Zaposlenik,String> {

    Zaposlenik findByOib(String oib);

    List<Zaposlenik> findByTimId(int tim_id);

    void  deleteByOib(String oib);

}
