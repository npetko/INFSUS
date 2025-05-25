package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.KorisnikRepository;
import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import com.progi.AlfaBeta.putninalozi.service.KorisnikService;
import com.progi.AlfaBeta.putninalozi.service.RequestDeniedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class KorisnikServiceImpl implements KorisnikService {

    @Autowired
    private KorisnikRepository korisnikRepo;

    @Override
    public List<Korisnik> listAll(){
        return korisnikRepo.findAll();
    }

    @Override
    public Korisnik findByUserName(String username){
        return korisnikRepo.findByKorisnickoIme(username);
    }

    @Override
    public Optional<Korisnik> authenticate(String username, String password){
        Optional<Korisnik> korisnik = Optional.ofNullable(korisnikRepo.findByKorisnickoIme(username));

        if(username == null || password == null || username.isEmpty() || password.isEmpty()){
            throw new RequestDeniedException("Username or password is missing");
        }

        if(korisnik.isEmpty()){
            throw new RequestDeniedException("No user with username " + username);
        }

        if(!korisnik.get().getZaporka().equals(password)){
            throw new RequestDeniedException("Password incorrect");
        }
        return korisnikRepo.findByKorisnickoImeAndZaporka(username,password);
    }

    @Transactional
    public Korisnik save(Korisnik korisnik) {
        Korisnik createResponse = null;
        createResponse = korisnikRepo.save(korisnik);
        return createResponse;
    }

    @Transactional
    public Korisnik update(Korisnik korisnik) {
        Korisnik updateResponse = korisnikRepo.save(korisnik);
        return updateResponse;
    }

    @Override
    public Korisnik findByOib(String oib){return korisnikRepo.findByOib(oib);}

    @Override
    @Transactional
    public void deleteKorisnikByKorisnickoIme(String korisnickoIme) {
        korisnikRepo.deleteByKorisnickoIme(korisnickoIme);
    }
}
