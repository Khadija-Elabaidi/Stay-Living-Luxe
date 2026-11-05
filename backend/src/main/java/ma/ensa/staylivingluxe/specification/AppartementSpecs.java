package ma.ensa.staylivingluxe.specification;

import ma.ensa.staylivingluxe.model.Appartement;
import ma.ensa.staylivingluxe.model.StatutAppartement;
import org.springframework.data.jpa.domain.Specification;

public final class AppartementSpecs {
    private AppartementSpecs() {}

    public static Specification<Appartement> motCle(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return null;
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("titre")), like),
                    cb.like(cb.lower(root.get("adresse")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }

    public static Specification<Appartement> litsEntre(Integer min, Integer max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null)
                return cb.between(root.get("nbreDeLit"), min, max);
            return min != null
                    ? cb.greaterThanOrEqualTo(root.get("nbreDeLit"), min)
                    : cb.lessThanOrEqualTo(root.get("nbreDeLit"), max);
        };
    }

    public static Specification<Appartement> prixEntre(Long min, Long max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null)
                return cb.between(root.get("prixParNuit"), min, max);
            return min != null
                    ? cb.greaterThanOrEqualTo(root.get("prixParNuit"), min)
                    : cb.lessThanOrEqualTo(root.get("prixParNuit"), max);
        };
    }

    public static Specification<Appartement> capaciteMin(Integer c) {
        return (root, query, cb) ->
                c == null ? null : cb.greaterThanOrEqualTo(root.get("capacite"), c);
    }

    public static Specification<Appartement> statut(StatutAppartement s) {
        return (root, query, cb) ->
                s == null ? null : cb.equal(root.get("statut"), s);
    }
}