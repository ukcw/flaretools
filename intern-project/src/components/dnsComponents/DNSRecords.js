import React from "react";

function humanize(str) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

/**
 *
 * @param {*} props
 * @returns
 */

const DNSRecords = (props) => {
  const keys = Object.keys(props.data.result[0]);
  const metaKeys = Object.keys(props.data.result[0].meta);

  return (
    <div>
      <h2>DNS Records</h2>
      <table>
        <thead>
          <tr>
            {keys.map((key) => {
              return key !== "meta" ? (
                <th rowSpan={2} key={key}>
                  {humanize(key)}
                </th>
              ) : (
                <th colSpan={4} key={key}>
                  {humanize(key)}
                </th>
              );
            })}
          </tr>
          <tr>
            {metaKeys.map((key) => (
              <th key={key}>{humanize(key)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.result.map((record) => (
            <tr key={record.id}>
              {keys.map((key) => {
                if (key !== "meta") {
                  return <td key={key}>{record[key].toString()}</td>;
                } else {
                  const metaColumnData = record[key];
                  return metaKeys.map((metaKey) => {
                    return (
                      <td key={metaKey}>
                        {metaColumnData[metaKey].toString()}
                      </td>
                    );
                  });
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DNSRecords;
