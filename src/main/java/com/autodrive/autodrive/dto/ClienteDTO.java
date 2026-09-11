package com.autodrive.autodrive.dto;

public class ClienteDTO {

    private Integer idCliente;
    private String nombre;
    private String dpi;
    private String telefono;
    private Boolean estado;

    public ClienteDTO() {
    }

    public ClienteDTO(Integer idCliente, String nombre, String dpi,
                      String telefono, Boolean estado) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.dpi = dpi;
        this.telefono = telefono;
        this.estado = estado;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDpi() {
        return dpi;
    }

    public void setDpi(String dpi) {
        this.dpi = dpi;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
