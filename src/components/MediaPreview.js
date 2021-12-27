import "./MediaPreview.css";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

export default function MediaPreview({src, closePreview}) {
  if(!src) return null;
  return (
      <div className="mediaPreview">
        <CancelOutlinedIcon 
            style={{
              width: 60,
              height: 60,
            }}
            onClick={closePreview}
            />
        <img src={src} alt="preview" />
      </div>
  );
}
