import { Box } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import TreeSelect, { NodeType, Option } from "./index";

const RANDOM_STRING = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Ut dapibus lectus non lacinia pulvinar.",
  "Vestibulum non sem ut justo vestibulum fermentum.",
  "Maecenas id est congue, egestas sem a, convallis leo.",
  "Etiam cursus neque egestas finibus mattis.",
  "Aliquam nec justo eget mauris viverra ultrices quis eu lorem.",
  "Donec at nulla vel magna tempus vehicula ac eget diam.",
  "Mauris lacinia sem quis convallis semper.",
  "Proin vehicula ante nec ex sodales, tincidunt hendrerit dui fringilla.",
  "Mauris dignissim magna eget nisl faucibus interdum.",
  "Sed tempor dui in odio consectetur porta.",
  "Donec congue elit non sapien sollicitudin rhoncus.",
  "Pellentesque pulvinar enim non ligula consectetur, ut gravida dolor molestie.",
  "Phasellus a mi eu ex bibendum dignissim.",
  "Aliquam eget dui pretium, aliquam leo eget, vulputate ligula.",
  "In tincidunt massa bibendum neque vehicula finibus.",
  "Quisque lobortis magna in cursus venenatis.",
  "Proin aliquam velit ac cursus auctor.",
  "Pellentesque ullamcorper ante venenatis metus bibendum, sit amet accumsan nibh feugiat.",
  "Vivamus vulputate quam et elementum iaculis.",
  "Suspendisse quis mauris egestas, tincidunt magna ac, ullamcorper ligula.",
  "Quisque vel arcu in tellus ornare rhoncus.",
  "Phasellus tempus nunc vel condimentum molestie.",
  "Donec placerat tellus sit amet libero pellentesque pretium.",
  "Pellentesque vitae nibh ornare, faucibus augue vitae, gravida dui.",
  "Suspendisse in mi ut eros commodo fringilla non ac neque.",
  "Aenean malesuada metus iaculis vulputate viverra.",
  "Nulla sollicitudin metus a quam rhoncus cursus.",
  "In non massa faucibus, facilisis ex eu, blandit est.",
  "Quisque id mauris sed tellus egestas mollis at ac felis.",
  "Nam sed lacus vel eros euismod ornare vel eget neque.",
  "Integer ullamcorper lorem id metus auctor bibendum.",
  "Aliquam sit amet magna a quam ullamcorper aliquet.",
  "Duis et odio sed ante convallis elementum.",
  "Fusce quis velit eget enim tincidunt rhoncus vitae et purus.",
  "Nunc vitae ante vel turpis porta ornare.",
  "Nulla in mauris consequat, bibendum tellus vehicula, tempus felis.",
  "In hendrerit erat dapibus quam tristique gravida.",
  "Pellentesque eget ante quis felis auctor scelerisque.",
  "Etiam pellentesque velit ac tellus tincidunt, a eleifend lectus varius.",
  "Mauris vitae dolor porta, sagittis ex eget, malesuada ante.",
  "Maecenas interdum enim et turpis facilisis blandit.",
  "Nam ac justo tristique, iaculis lacus sit amet, venenatis ex.",
  "Aliquam porttitor mi lobortis, venenatis nibh ac, volutpat enim.",
  "Proin gravida quam vel iaculis vestibulum.",
  "In vitae diam aliquet, eleifend nulla vitae, viverra mi.",
  "Mauris ut enim sit amet odio tempus auctor eu eu felis.",
  "Vestibulum pretium quam quis lacus gravida pretium.",
  "Ut nec magna eu tellus lobortis posuere.",
  "Nam a nibh non ex pharetra molestie in sed mauris.",
  "Sed id ex id enim volutpat ullamcorper.",
  "Vivamus sagittis arcu eget lectus ultrices dapibus.",
  "Nullam id eros ac lectus gravida pretium.",
  "Nulla aliquet libero non arcu ullamcorper faucibus.",
  "Nullam malesuada tortor eu diam efficitur, et posuere mi condimentum.",
  "In accumsan risus rutrum, imperdiet eros eget, ornare augue.",
  "In tristique augue quis ante sagittis, nec facilisis arcu vehicula.",
  "Aliquam sit amet diam sit amet massa vulputate consequat.",
  "Cras semper leo nec elit maximus bibendum.",
  "Integer pellentesque justo vel rhoncus congue.",
  "Pellentesque a metus maximus elit vehicula volutpat vitae id elit.",
  "Donec vel lectus nec odio fringilla bibendum nec at elit.",
  "Vestibulum vel nisl in purus feugiat finibus quis in arcu.",
  "Donec condimentum sem sed magna porttitor laoreet.",
  "Donec consequat felis eleifend lacinia luctus.",
  "Morbi quis orci eget diam dictum auctor.",
  "Fusce dapibus dolor vel enim facilisis lobortis.",
  "Suspendisse vitae metus eu lectus condimentum ullamcorper.",
  "Fusce ut turpis eget dolor lobortis finibus.",
  "Etiam et quam eget ligula aliquet facilisis euismod ut odio.",
  "Suspendisse cursus lorem eget neque porttitor, in convallis erat viverra.",
  "Praesent at lectus hendrerit, faucibus ante in, bibendum risus.",
  "Phasellus vulputate lectus eu bibendum sodales.",
  "Integer at dui congue eros luctus ultricies.",
  "Curabitur quis sapien at nunc tincidunt efficitur.",
  "Quisque id arcu consequat, pharetra nunc ac, facilisis purus.",
  "Cras eget quam vel augue aliquet mollis.",
  "Aliquam non orci quis ligula facilisis ultrices.",
  "Sed eget lectus nec est vulputate accumsan non et metus.",
  "Praesent eget risus dapibus, efficitur est non, egestas ex.",
  "Maecenas ut ante eget ante faucibus porta vitae ac sapien.",
  "Etiam fermentum sapien a felis euismod lobortis vel et ipsum.",
  "Ut ut sem vel nibh interdum bibendum.",
  "Nulla hendrerit diam et turpis finibus, sit amet gravida purus vulputate.",
  "Nam malesuada nibh quis laoreet laoreet.",
  "Donec mollis orci nec leo elementum congue.",
  "Pellentesque ac orci nec velit pretium cursus.",
  "Pellentesque et lacus ut sem sollicitudin euismod.",
  "Pellentesque tristique quam eget lacus varius tristique.",
  "Mauris mollis tortor vel nunc porttitor, sit amet tempus lectus varius.",
  "Aliquam tincidunt mauris non justo hendrerit, non fringilla purus rhoncus.",
  "In fermentum nibh eu nulla commodo, quis posuere ipsum fermentum.",
  "Vivamus placerat lorem vel ipsum semper, nec auctor ligula mattis.",
  "Phasellus quis neque sit amet velit vehicula tincidunt id quis risus.",
  "Integer malesuada diam a enim volutpat iaculis.",
  "Fusce gravida mauris vitae elementum tristique.",
  "Proin aliquet velit ut tortor pulvinar tristique.",
  "Vestibulum bibendum ipsum id felis pharetra molestie.",
  "Vestibulum aliquam nunc a bibendum mattis.",
  "Aenean quis elit accumsan, placerat eros quis, consectetur enim.",
  "Integer pulvinar nulla id imperdiet pulvinar.",
  "Sed a dolor eu enim fringilla sollicitudin vel sit amet justo.",
  "Vestibulum interdum ligula sit amet elit maximus malesuada.",
  "Praesent venenatis leo elementum dictum malesuada.",
  "Nunc ac eros euismod, dignissim mi id, placerat lectus.",
  "Phasellus accumsan lectus vitae lectus hendrerit, eget condimentum arcu aliquam.",
  "Curabitur et est interdum, luctus orci sed, viverra sapien.",
  "Vestibulum at leo vel enim dictum molestie eget id lacus.",
  "Curabitur convallis ligula eget laoreet venenatis.",
  "Donec aliquet eros vitae neque hendrerit, et consequat nunc viverra.",
  "Sed at est ut odio blandit posuere vitae non lectus.",
  "Maecenas at quam vel leo varius efficitur.",
  "Vivamus lobortis nibh vitae dui consequat, eu eleifend massa vulputate.",
  "Etiam finibus magna quis massa semper, eu sagittis arcu tempus.",
  "Nulla quis orci vehicula, dapibus lorem tempus, lacinia massa.",
  "Sed a lacus aliquam, scelerisque libero facilisis, malesuada nulla.",
  "Fusce ut velit vel est blandit bibendum ac in risus.",
  "In elementum mi et nisi molestie malesuada.",
  "Proin maximus neque at pharetra dictum.",
  "Donec rhoncus libero vitae dui tincidunt lobortis.",
  "Donec ut nibh id nisi fermentum sodales vitae ut nulla.",
  "Donec hendrerit ante eu massa tincidunt vehicula.",
  "Proin laoreet velit ultricies nibh lacinia, sed maximus dolor porta.",
  "Sed cursus dui sed arcu malesuada dapibus ac nec magna.",
  "Nullam et lorem vitae dolor sollicitudin sollicitudin in sit amet est.",
  "Aliquam congue risus vel libero ultrices consequat.",
  "Nulla aliquet nisl in justo auctor molestie.",
  "Maecenas ut ex ut leo rhoncus eleifend vitae id orci.",
  "Nullam in neque sodales, vestibulum massa quis, ullamcorper orci.",
  "Quisque sed risus consectetur, gravida orci sit amet, gravida libero.",
  "Fusce ut urna nec turpis efficitur placerat vel sit amet lorem.",
  "Suspendisse a ligula id lacus tempus dictum.",
  "Nunc vitae ex eget mauris vulputate sollicitudin.",
  "Donec hendrerit massa ac nulla varius, et porta nulla tincidunt.",
  "Quisque vehicula sem id tellus egestas gravida.",
  "Aliquam at erat eu neque ornare luctus at a eros.",
  "Fusce egestas dolor ut arcu euismod elementum.",
  "Nullam non tortor eu risus dignissim molestie.",
  "Etiam eget dui convallis, tempus justo ut, venenatis ipsum.",
  "Mauris dapibus enim sit amet luctus facilisis.",
  "Quisque ut ex non purus iaculis finibus eu at libero.",
  "In eu augue a lectus sollicitudin commodo.",
  "Nunc et ante at justo mollis cursus vitae id risus.",
  "Nulla eu justo ut turpis vehicula varius eu et felis.",
  "Quisque sit amet justo ullamcorper mauris rhoncus accumsan.",
  "Fusce elementum odio ac metus pharetra, at ultrices lectus tristique.",
  "Nullam vitae risus ut nibh suscipit iaculis.",
  "Fusce varius neque tempus nunc finibus, in gravida risus fermentum.",
  "Mauris tempus dui in ante consectetur, tempor suscipit nibh convallis.",
  "Etiam nec libero a sapien interdum consequat.",
  "Aliquam tincidunt augue eu felis vulputate ullamcorper.",
  "Nunc lacinia nulla at nibh venenatis, sit amet commodo neque bibendum.",
  "Nullam pulvinar orci sed risus semper, non condimentum lectus tristique.",
  "Curabitur nec mi id augue finibus commodo id ut turpis.",
  "Aliquam sed risus in augue tristique mattis non ut felis.",
  "Morbi mollis quam at malesuada suscipit.",
  "Mauris id erat sit amet felis elementum consectetur.",
  "Suspendisse sed lectus id nibh placerat blandit.",
  "Nulla dignissim arcu in dui fringilla, vitae varius magna tempor.",
  "Morbi ac felis non mauris bibendum maximus quis sagittis ligula.",
  "Ut vestibulum arcu aliquet sem vestibulum, sed rutrum dui varius.",
  "Praesent sit amet dolor in mauris pulvinar tempus.",
  "Nullam ultrices odio ut urna mattis, et ultricies est dictum.",
  "Duis quis lectus nec nulla viverra consequat.",
  "Cras id lectus congue mi commodo feugiat.",
  "Donec ultrices felis ut ornare ullamcorper.",
  "Fusce mollis nibh vitae velit aliquet mattis.",
  "Praesent venenatis ipsum efficitur massa hendrerit, et blandit erat commodo.",
  "Nulla dapibus erat ut erat dapibus suscipit.",
  "Morbi sed odio in felis scelerisque placerat non non nibh.",
  "Ut laoreet nulla at ex porta sodales.",
  "Aenean non magna ac massa facilisis faucibus.",
  "Phasellus varius purus fringilla diam varius cursus.",
  "Maecenas posuere quam eu maximus ullamcorper.",
  "Ut eu eros non neque interdum feugiat ut nec nisi.",
  "Pellentesque mollis orci et placerat tristique.",
  "Vivamus consequat risus quis lectus cursus tristique.",
  "Duis sit amet magna et arcu finibus cursus.",
  "Cras sit amet lacus nec nisi egestas tincidunt.",
  "Suspendisse finibus quam id condimentum blandit.",
  "Aliquam aliquet massa vel sapien volutpat suscipit.",
] as const;

const getRandomString = (numWords = 0, index?: number): string => {
  const randomStr = (() => {
    if (index === undefined) {
      return RANDOM_STRING[Math.floor(Math.random() * RANDOM_STRING.length)];
    } else {
      return RANDOM_STRING[index];
    }
  })();

  if (numWords) {
    return randomStr.split(" ").splice(0, numWords).join(" ");
  }

  return randomStr;
};

const treeData = {
  foo: ["baz", "qux", "quux"],
  bar: ["quuz", "corge"],
};

const Sample: React.FC = () => {
  const [value, setValue] = useState<{ value: string } | null>(null);

  return (
    <div style={{ width: 350, padding: 16 }}>
      <TreeSelect<{ value: string }, false, false, true>
        // defaultValue={[]}
        // multiple
        freeSolo
        // disableClearable
        disableCloseOnSelect
        // debug
        autoSelect
        // autoHighlight
        getOptionLabel={(v) => v.value.toString()}
        textFieldProps={useMemo(
          () => ({
            variant: "outlined",
            label: "Sample",
          }),
          []
        )}
        value={value}
        onChange={useCallback((...args) => {
          console.log("onChange CB", ...args);
          setValue(args[0]);
        }, [])}
        getOptions={useCallback((_parent) => {
          console.log("getOptions CG", _parent);
          const options = new Map<string, Option<{ value: string }>>();
          for (
            let i = 0, stop = Math.max(4, Math.ceil(Math.random() * 10));
            i < stop;
            i++
          ) {
            const value = getRandomString(1);
            options.set(value, {
              option: {
                value,
              },
              type: Math.floor(Math.random() * 3) as NodeType,
            });
          }
          return new Promise<Option<{ value: string }>[]>((resolve) =>
            setTimeout(
              () => resolve([...options.values()]),
              Math.random() * 200
            )
          );
        }, [])}
      />

      <Box paddingTop={2}>
        <TreeSelect<string, false, false, false>
          onChange={useCallback((...args) => {
            console.log("onChange", ...args);
          }, [])}
          getOptions={useCallback((value) => {
            if (value) {
              return treeData[value as "foo" | "bar"].map((option) => ({
                option,
                type: NodeType.Leaf,
              }));
            } else {
              return Object.keys(treeData).map((option, i) => ({
                option,
                type: i % 2 === 0 ? NodeType.Branch : NodeType.SelectableBranch,
              }));
            }
          }, [])}
          textFieldProps={useMemo(
            () => ({
              variant: "outlined",
              label: "Sample",
            }),
            []
          )}
        />
      </Box>
    </div>
  );
};

ReactDOM.render(<Sample />, document.getElementById("root"));
