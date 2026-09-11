package com.autodrive.autodrive.dto;

import java.math.BigDecimal;

public class VehiculoDTO {

    private Integer idVehiculo;
    private String placa;
    private String marca;
    private String modelo;
    private String color;
    private String tipo;
    private BigDecimal precioDia;
    private Boolean estado;

    public VehiculoDTO() {}

    public VehiculoDTO(
            Integer idVehiculo,
            String placa,
            String marca,
            String modelo,
            String color,
            String tipo,
            BigDecimal precioDia,
            Boolean estado) {

        this.idVehiculo = idVehiculo;
        this.placa = placa;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
        this.tipo = tipo;
        this.precioDia = precioDia;
        this.estado = estado;
    }

    public Integer getIdVehiculo() {
        return idVehiculo;
    }

    public void setIdVehiculo(Integer idVehiculo) {
        this.idVehiculo = idVehiculo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getPrecioDia() {
        return precioDia;
    }

    public void setPrecioDia(BigDecimal precioDia) {
        this.precioDia = precioDia;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
