import {useContext} from "react";
import {MainContext} from "../contexts/MainContext";

export default function Loading() {

  const context = useContext(MainContext)

  return context.loading ?
    <div className="loading">
      <i className="pi pi-spin pi-spinner"/>
    </div> :
    null
}
