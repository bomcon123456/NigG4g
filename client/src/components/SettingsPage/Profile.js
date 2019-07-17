/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { userInfo } from "../../common/states/user-info"

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: userInfo.getState()
    };
  }

  render() {
    console.log(userInfo.getState());
    return (
      <form id="setting-form">
        <h2>Profile</h2>

        <div className="field avatar">
          <label>Avatar</label>
          <div className="avatar-content">
            <div className="avatar-container">
              <div>
                <img
                  src={this.state.data.avatarURL}
                  alt="avatar"
                />
              </div>
            </div>

            <div className="control">
              <input type="file" name="avatar" accept=".jpg, .gif, .png" />
              <p className="tips">JPG, GIF or PNG, Max size: 2MB</p>
              <Link to="#">Random</Link>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Your Name</label>
          <input
            type="text"
            name="fullName"
            defaultValue={this.state.data.username}
            maxLength="20"
          />
          <p className="tips">
            This is the name that will be visible to other users on 9GAG.
          </p>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="emojiStatus">
            <option value="">None</option>
            <option value="🎃">🎃 Jack-O-Lantern</option>
            <option value="💀">💀 Skull</option>
            <option value="👻">👻 Ghost</option>
            <option value="🧛">🧛 Vampire</option>
            <option value="🧟">🧟 Zombie</option>
            <option value="🦇">🦇 Bat</option>
          </select>
        </div>

        <div className="field">
          <label>Gender</label>
          <select name="gender">
            <option>Select Gender...</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="X">Unspecified</option>
          </select>
        </div>

        <div className="field">
          <label>Birthday</label>
          <div className="date-picker">
            <input
              className="year"
              type="text"
              name="dob_year"
              placeholder="YYYY"
            />
            <input
              className="month"
              type="text"
              name="dob_month"
              placeholder="MM"
            />
            <input
              className="day"
              type="text"
              name="dob_day"
              placeholder="DD"
            />
          </div>
        </div>

        <div className="field">
          <label>Country</label>
          <select name="country" id="country_selector">
            <option value=""></option>
            <option value="af">Afghanistan</option>
            <option value="ax">Åland Islands</option>
            <option value="al">Albania</option>
            <option value="dz">Algeria</option>
            <option value="as">American Samoa</option>
            <option value="ad">Andorra</option>
            <option value="ao">Angola</option>
            <option value="ai">Anguilla</option>
            <option value="aq">Antarctica</option>
            <option value="ag">Antigua &amp; Barbuda</option>
            <option value="ar">Argentina</option>
            <option value="am">Armenia</option>
            <option value="aw">Aruba</option>
            <option value="au">Australia</option>
            <option value="at">Austria</option>
            <option value="az">Azerbaijan</option>
            <option value="bs">Bahamas</option>
            <option value="bh">Bahrain</option>
            <option value="bd">Bangladesh</option>
            <option value="bb">Barbados</option>
            <option value="by">Belarus</option>
            <option value="be">Belgium</option>
            <option value="bz">Belize</option>
            <option value="bj">Benin</option>
            <option value="bm">Bermuda</option>
            <option value="bt">Bhutan</option>
            <option value="bo">Bolivia</option>
            <option value="ba">Bosnia &amp; Herzegovina</option>
            <option value="bw">Botswana</option>
            <option value="bv">Bouvet Island</option>
            <option value="br">Brazil</option>
            <option value="io">British Indian Ocean Territory</option>
            <option value="bn">Brunei</option>
            <option value="bg">Bulgaria</option>
            <option value="bf">Burkina Faso</option>
            <option value="bi">Burundi</option>
            <option value="kh">Cambodia</option>
            <option value="cm">Cameroon</option>
            <option value="ca">Canada</option>
            <option value="cv">Cape Verde</option>
            <option value="bq">Caribbean Netherlands</option>
            <option value="ky">Cayman Islands</option>
            <option value="cf">Central African Republic</option>
            <option value="td">Chad</option>
            <option value="cl">Chile</option>
            <option value="cx">Christmas Island</option>
            <option value="cc">Cocos (Keeling) Islands</option>
            <option value="co">Colombia</option>
            <option value="km">Comoros</option>
            <option value="cg">Congo - Brazzaville</option>
            <option value="cd">Congo - Kinshasa</option>
            <option value="ck">Cook Islands</option>
            <option value="cr">Costa Rica</option>
            <option value="ci">Côte d’Ivoire</option>
            <option value="hr">Croatia</option>
            <option value="cu">Cuba</option>
            <option value="cw">Curaçao</option>
            <option value="cy">Cyprus</option>
            <option value="cz">Czechia</option>
            <option value="dk">Denmark</option>
            <option value="dj">Djibouti</option>
            <option value="dm">Dominica</option>
            <option value="do">Dominican Republic</option>
            <option value="ec">Ecuador</option>
            <option value="eg">Egypt</option>
            <option value="sv">El Salvador</option>
            <option value="gq">Equatorial Guinea</option>
            <option value="er">Eritrea</option>
            <option value="ee">Estonia</option>
            <option value="sz">Eswatini</option>
            <option value="et">Ethiopia</option>
            <option value="fk">Falkland Islands</option>
            <option value="fo">Faroe Islands</option>
            <option value="fj">Fiji</option>
            <option value="fi">Finland</option>
            <option value="fr">France</option>
            <option value="gf">French Guiana</option>
            <option value="pf">French Polynesia</option>
            <option value="tf">French Southern Territories</option>
            <option value="ga">Gabon</option>
            <option value="gm">Gambia</option>
            <option value="ge">Georgia</option>
            <option value="de">Germany</option>
            <option value="gh">Ghana</option>
            <option value="gi">Gibraltar</option>
            <option value="gr">Greece</option>
            <option value="gl">Greenland</option>
            <option value="gd">Grenada</option>
            <option value="gp">Guadeloupe</option>
            <option value="gu">Guam</option>
            <option value="gt">Guatemala</option>
            <option value="gg">Guernsey</option>
            <option value="gn">Guinea</option>
            <option value="gw">Guinea-Bissau</option>
            <option value="gy">Guyana</option>
            <option value="ht">Haiti</option>
            <option value="hn">Honduras</option>
            <option value="hk">Hong Kong SAR China</option>
            <option value="hu">Hungary</option>
            <option value="is">Iceland</option>
            <option value="in">India</option>
            <option value="id">Indonesia</option>
            <option value="ir">Iran</option>
            <option value="iq">Iraq</option>
            <option value="ie">Ireland</option>
            <option value="im">Isle of Man</option>
            <option value="il">Israel</option>
            <option value="it">Italy</option>
            <option value="jm">Jamaica</option>
            <option value="jp">Japan</option>
            <option value="je">Jersey</option>
            <option value="jo">Jordan</option>
            <option value="kz">Kazakhstan</option>
            <option value="ke">Kenya</option>
            <option value="ki">Kiribati</option>
            <option value="xk">Kosovo</option>
            <option value="kw">Kuwait</option>
            <option value="kg">Kyrgyzstan</option>
            <option value="la">Laos</option>
            <option value="lv">Latvia</option>
            <option value="lb">Lebanon</option>
            <option value="ls">Lesotho</option>
            <option value="lr">Liberia</option>
            <option value="ly">Libya</option>
            <option value="li">Liechtenstein</option>
            <option value="lt">Lithuania</option>
            <option value="lu">Luxembourg</option>
            <option value="mo">Macao SAR China</option>
            <option value="mg">Madagascar</option>
            <option value="mw">Malawi</option>
            <option value="my">Malaysia</option>
            <option value="mv">Maldives</option>
            <option value="ml">Mali</option>
            <option value="mt">Malta</option>
            <option value="mh">Marshall Islands</option>
            <option value="mq">Martinique</option>
            <option value="mr">Mauritania</option>
            <option value="mu">Mauritius</option>
            <option value="yt">Mayotte</option>
            <option value="mx">Mexico</option>
            <option value="fm">Micronesia</option>
            <option value="md">Moldova</option>
            <option value="mc">Monaco</option>
            <option value="mn">Mongolia</option>
            <option value="me">Montenegro</option>
            <option value="ms">Montserrat</option>
            <option value="ma">Morocco</option>
            <option value="mz">Mozambique</option>
            <option value="na">Namibia</option>
            <option value="nr">Nauru</option>
            <option value="np">Nepal</option>
            <option value="nl">Netherlands</option>
            <option value="nc">New Caledonia</option>
            <option value="nz">New Zealand</option>
            <option value="ni">Nicaragua</option>
            <option value="ne">Niger</option>
            <option value="ng">Nigeria</option>
            <option value="nu">Niue</option>
            <option value="nf">Norfolk Island</option>
            <option value="mk">North Macedonia</option>
            <option value="mp">Northern Mariana Islands</option>
            <option value="no">Norway</option>
            <option value="om">Oman</option>
            <option value="pk">Pakistan</option>
            <option value="pw">Palau</option>
            <option value="ps">Palestinian Territories</option>
            <option value="pa">Panama</option>
            <option value="pg">Papua New Guinea</option>
            <option value="py">Paraguay</option>
            <option value="pe">Peru</option>
            <option value="ph">Philippines</option>
            <option value="pn">Pitcairn Islands</option>
            <option value="pl">Poland</option>
            <option value="pt">Portugal</option>
            <option value="pr">Puerto Rico</option>
            <option value="qa">Qatar</option>
            <option value="re">Réunion</option>
            <option value="ro">Romania</option>
            <option value="ru">Russia</option>
            <option value="rw">Rwanda</option>
            <option value="ws">Samoa</option>
            <option value="sm">San Marino</option>
            <option value="st">São Tomé &amp; Príncipe</option>
            <option value="sa">Saudi Arabia</option>
            <option value="sn">Senegal</option>
            <option value="rs">Serbia</option>
            <option value="sc">Seychelles</option>
            <option value="sl">Sierra Leone</option>
            <option value="sg">Singapore</option>
            <option value="sx">Sint Maarten</option>
            <option value="sk">Slovakia</option>
            <option value="si">Slovenia</option>
            <option value="sb">Solomon Islands</option>
            <option value="so">Somalia</option>
            <option value="za">South Africa</option>
            <option value="gs">South Georgia &amp; South Sandwich Islands</option>
            <option value="kr">South Korea</option>
            <option value="es">Spain</option>
            <option value="lk">Sri Lanka</option>
            <option value="bl">St. Barthélemy</option>
            <option value="sh">St. Helena</option>
            <option value="kn">St. Kitts &amp; Nevis</option>
            <option value="lc">St. Lucia</option>
            <option value="mf">St. Martin</option>
            <option value="pm">St. Pierre &amp; Miquelon</option>
            <option value="vc">St. Vincent &amp; Grenadines</option>
            <option value="sr">Suriname</option>
            <option value="se">Sweden</option>
            <option value="ch">Switzerland</option>
            <option value="tw">Taiwan</option>
            <option value="tj">Tajikistan</option>
            <option value="tz">Tanzania</option>
            <option value="th">Thailand</option>
            <option value="tl">Timor-Leste</option>
            <option value="tg">Togo</option>
            <option value="tk">Tokelau</option>
            <option value="to">Tonga</option>
            <option value="tt">Trinidad &amp; Tobago</option>
            <option value="tn">Tunisia</option>
            <option value="tr">Turkey</option>
            <option value="tm">Turkmenistan</option>
            <option value="tc">Turks &amp; Caicos Islands</option>
            <option value="tv">Tuvalu</option>
            <option value="vi">U.S. Virgin Islands</option>
            <option value="ug">Uganda</option>
            <option value="ua">Ukraine</option>
            <option value="ae">United Arab Emirates</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States</option>
            <option value="uy">Uruguay</option>
            <option value="uz">Uzbekistan</option>
            <option value="vu">Vanuatu</option>
            <option value="va">Vatican City</option>
            <option value="ve">Venezuela</option>
            <option value="vn">Vietnam</option>
            <option value="wf">Wallis &amp; Futuna</option>
            <option value="ye">Yemen</option>
            <option value="zm">Zambia</option>
            <option value="zw">Zimbabwe</option>
          </select>
          <p className="tips">Tell us where you're from so we can provide better service for you.</p>
        </div>

        <div className="field">
          <label>Tell people who you are</label>
          <textarea name="blogTitle" maxLength="120" defaultValue="My Funny Collection"></textarea>
        </div>

        <div className="setting-social-connect">
          <label>Social Networks</label>

          <div className="connection">
            <div className="field social">
              <p className="label">Facebook connected</p>
              <button className="my-button">Connect now</button>
            </div>
          </div>

          <div className="connection">
            <div className="field">
              <p className="label">Google not connected</p>
              <button className="my-button">Connect now</button>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Your 9GAG Data</label>
          <p className="tips">You can <Link to="#">request</Link> a PDF with your 9GAG data. We’ll send it to your email once ready.</p>
        </div>

        <div className="my-btn-container">
          <input type="submit" value="Save Changes" />
        </div>

      </form>
    );
  }
}

export default Profile;
