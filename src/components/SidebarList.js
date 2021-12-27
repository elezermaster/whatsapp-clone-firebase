import { CircularProgress } from "@material-ui/core";
import "./SidebarList.css";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { CancelOutlined } from "@material-ui/icons";
import SidebarListItem from './SidebarListItem'

export default function SidebarList({title, data}) {
  if(!data){
    return (
      <div className="loader__container sidebar__loader">
        <CircularProgress/>
      </div>
    )
  }
  if(!data.length && title === "Search results"){
    return (
      <div className="no-result">
        <div>
          <SearchOutlinedIcon/>
          <div className="cancel-root">
            <CancelOutlined/>
          </div>
        </div>
       <h2>No {title}</h2>
      </div>
    )
  }

  return (
  <div className="sidebar__chat--container">
    <h2>{title}</h2>
    {data.map(item => (
      <SidebarListItem  key={item.id} item={item}/>
    ))}
  </div>);
}
