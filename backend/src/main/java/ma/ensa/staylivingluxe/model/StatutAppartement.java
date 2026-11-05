package ma.ensa.staylivingluxe.model;

public enum StatutAppartement {
    DISPONIBLE ("disponible"),
    RESERVE ("reserve"),
    INDISPONIBLE("indisponible");

    private final String status;

    StatutAppartement(String status){
         this.status=status;
    }

    public String getDescription(){
        return status;
    }


}
