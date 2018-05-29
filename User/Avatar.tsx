import * as React from "react";
import {IAvatarUser} from "./index";


interface IProps {
  user:IAvatarUser
  showUserName?:boolean
}

/**
 * Obrazok uzivatela, resp. default obrazok tvare, plus meno uzivatela
 *
 * prelinkovane na profil uzivatela
 */
export class Avatar extends React.Component<IProps> {
  render() {
    const {user} = this.props
    return (
      <div className="Avatar">
        <a href={user.link}>

          {(!!user.avatarUrl) && (
            <img src={user.avatarUrl} title={user.name}/>
          )}
          {(!user.avatarUrl) && (
            <i className="avatarPlaceholder fa fa-user" title={user.name}/>
          )}

          {(!!this.props.showUserName) && (
            <span className="userName">
              {user.name}
            </span>
          )}

        </a>
      </div>
    )
  }
}
