/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.82884310618067, "KoPercent": 32.17115689381934};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5155889145496536, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e992b797-3c0c-478b-8e98-62177a79f198"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9fa85ea-eefd-447e-9eb2-28ddb14202e5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98f183b4-0b0b-45de-89b7-c60c912234b8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7287076e-c99e-4567-86eb-9933bd4b1f77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9fa85ea-eefd-447e-9eb2-28ddb14202e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/273bd461-7157-4d8c-b423-ff565147ff2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e891458-79b9-4d8f-9d89-1e9fa79685fc"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55198790-d912-4d4d-892b-653182f4a551"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a95b9b17-a4ed-42b6-8d68-2770df84718f"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af4a8f62-39d7-4aba-92f3-025023bf45e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=537ae55f-73f9-4255-8c2c-c81f0e58518d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60afe1e1-833f-4d2e-8bd9-3711e44320ca"], "isController": false}, {"data": [0.8953488372093024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/537ae55f-73f9-4255-8c2c-c81f0e58518d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55198790-d912-4d4d-892b-653182f4a551"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60afe1e1-833f-4d2e-8bd9-3711e44320ca"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=621fe718-7ec1-4b7d-918f-f236186df2a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2689530-910a-47f1-aa84-74155d47b26b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db1a4fb6-b40f-464a-bdbc-37ae15fb9d1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af4a8f62-39d7-4aba-92f3-025023bf45e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afcfc162-ac42-41a2-8cb0-43ac8219e3d9"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a95b9b17-a4ed-42b6-8d68-2770df84718f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2689530-910a-47f1-aa84-74155d47b26b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8281164-d5f2-430b-b0c8-c7f5c7b99245"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afcfc162-ac42-41a2-8cb0-43ac8219e3d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7287076e-c99e-4567-86eb-9933bd4b1f77"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4362e2c-2d51-4cd3-a36f-bc5395f16110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8281164-d5f2-430b-b0c8-c7f5c7b99245"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98f183b4-0b0b-45de-89b7-c60c912234b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/621fe718-7ec1-4b7d-918f-f236186df2a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4362e2c-2d51-4cd3-a36f-bc5395f16110"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db1a4fb6-b40f-464a-bdbc-37ae15fb9d1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15df6eda-554c-4d4b-8baf-5c6d8bc56242"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86c19ee3-95f5-497f-8670-7f37d6ae6459"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e992b797-3c0c-478b-8e98-62177a79f198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15df6eda-554c-4d4b-8baf-5c6d8bc56242"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 631, 203, 32.17115689381934, 314.7290015847861, 117, 2844, 133.0, 756.8000000000004, 1093.7999999999997, 1929.6799999999976, 2.4829225296691533, 2.622911243881229, 1.1943500478090472], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e992b797-3c0c-478b-8e98-62177a79f198", 3, 0, 0.0, 351.6666666666667, 233, 448, 374.0, 448.0, 448.0, 448.0, 0.07671064743786438, 0.03555858136442672, 0.049192700342640894], "isController": false}, {"data": ["see books", 60, 60, 100.0, 696.7166666666667, 484, 1045, 760.0, 878.2, 903.95, 1045.0, 0.2544367406653521, 1.637439571274092, 0.42712573945677756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 128.75000000000003, 119, 135, 130.0, 134.7, 135.0, 135.0, 0.05752140275527519, 0.04465772967816775, 0.02044706113566423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, 100.0, 139.11111111111111, 118, 356, 126.0, 157.1000000000003, 356.0, 356.0, 0.10033948191380838, 0.04987577763098484, 0.0503657165075171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9fa85ea-eefd-447e-9eb2-28ddb14202e5", 3, 0, 0.0, 657.3333333333334, 406, 915, 651.0, 915.0, 915.0, 915.0, 0.05118231139318252, 0.032905294596854, 0.032821990053570824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 160.31578947368425, 117, 463, 125.0, 449.0, 463.0, 463.0, 0.11250725375715014, 0.05592401578358342, 0.056473367608569504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 2.234256628787879, 4.683061079545454], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 224.61666666666667, 118, 653, 128.0, 494.9, 506.65, 653.0, 0.2607459942896627, 0.12960909286468586, 0.1260442062240069], "isController": false}, {"data": ["deleteBook", 17, 1, 5.882352941176471, 499.2352941176471, 125, 1373, 437.0, 880.9999999999995, 1373.0, 1373.0, 0.0978636931455118, 0.018338198933861412, 0.06624126242724986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, 5.882352941176471, 499.2352941176471, 125, 1373, 437.0, 880.9999999999995, 1373.0, 1373.0, 0.09991477857121867, 0.01872254180258015, 0.06762958616180316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 5, 18.51851851851852, 929.2222222222223, 191, 1644, 923.0, 1602.0, 1636.8, 1644.0, 0.10660854526717287, 0.03387042323592471, 0.04809877725921275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98f183b4-0b0b-45de-89b7-c60c912234b8", 3, 0, 0.0, 357.0, 211, 517, 343.0, 517.0, 517.0, 517.0, 0.08116443915372545, 0.037623099399383145, 0.05204881026459607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7287076e-c99e-4567-86eb-9933bd4b1f77", 3, 0, 0.0, 510.3333333333333, 291, 815, 425.0, 815.0, 815.0, 815.0, 0.08433362381581536, 0.03815876858853625, 0.0540811324600118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9fa85ea-eefd-447e-9eb2-28ddb14202e5", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 157.2, 123, 386, 132.0, 362.1000000000001, 386.0, 386.0, 0.04847192263881146, 0.03815270473328324, 0.017230253750515012], "isController": false}, {"data": ["deleteAccount", 17, 1, 5.882352941176471, 503.52941176470586, 123, 912, 437.0, 827.1999999999999, 912.0, 912.0, 0.09985315712187959, 0.019898357195301027, 0.06746741923641704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/273bd461-7157-4d8c-b423-ff565147ff2d", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e891458-79b9-4d8f-9d89-1e9fa79685fc", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1429.1666666666665, 801, 2545, 1258.0, 2522.5, 2543.75, 2545.0, 0.10095741279803469, 0.052253348420857805, 0.04643646623815854], "isController": false}, {"data": ["goToProfile", 17, 1, 5.882352941176471, 294.5882352941177, 123, 815, 226.0, 683.7999999999998, 815.0, 815.0, 0.09713730643963203, 0.14536557732415292, 0.06231228751214217], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, 100.0, 127.4, 122, 133, 128.5, 132.8, 133.0, 133.0, 0.04945940866331002, 0.02458480372033672, 0.024826304739200538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55198790-d912-4d4d-892b-653182f4a551", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a95b9b17-a4ed-42b6-8d68-2770df84718f", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["addBook", 56, 56, 100.0, 837.9821428571429, 481, 3257, 732.0, 1202.0000000000018, 1907.299999999999, 3257.0, 0.25785181808554236, 0.9252700249563723, 0.5020745056497176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/af4a8f62-39d7-4aba-92f3-025023bf45e3", 3, 0, 0.0, 407.66666666666663, 209, 795, 219.0, 795.0, 795.0, 795.0, 0.046674445740956826, 0.030007171334111238, 0.0299312038117464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=537ae55f-73f9-4255-8c2c-c81f0e58518d", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 154.68421052631578, 121, 366, 127.0, 354.0, 366.0, 366.0, 0.11114490956314202, 0.08303306232012074, 0.039508542071273134], "isController": false}, {"data": ["deleteBooks", 17, 1, 5.882352941176471, 369.1764705882353, 132, 926, 318.0, 729.9999999999998, 926.0, 926.0, 0.10005885815185403, 0.01874954017068864, 0.06856629819011183], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60afe1e1-833f-4d2e-8bd9-3711e44320ca", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 0.1951015793736501, 0.7445498110151187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 232.25000000000003, 119, 2844, 132.0, 384.40000000000003, 484.64999999999964, 2084.8000000000106, 0.7107056232516435, 1.6853433493242098, 0.3359234899055009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 128.85714285714286, 124, 145, 126.0, 145.0, 145.0, 145.0, 0.0334726432868223, 0.02592168567036141, 0.011898478668362614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/537ae55f-73f9-4255-8c2c-c81f0e58518d", 3, 0, 0.0, 315.0, 201, 412, 332.0, 412.0, 412.0, 412.0, 0.08817305431460146, 0.039034945920526684, 0.056543267252527625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55198790-d912-4d4d-892b-653182f4a551", 3, 0, 0.0, 304.0, 194, 467, 251.0, 467.0, 467.0, 467.0, 0.0250689395838556, 0.02514238374279268, 0.016076110345115736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60afe1e1-833f-4d2e-8bd9-3711e44320ca", 3, 0, 0.0, 697.6666666666666, 219, 962, 912.0, 962.0, 962.0, 962.0, 0.01710649362498004, 0.02358268245500992, 0.010969984518623268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, 100.0, 183.94117647058823, 119, 382, 128.0, 369.2, 382.0, 382.0, 0.09215790443767415, 0.04580895835817982, 0.046258948125941904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=621fe718-7ec1-4b7d-918f-f236186df2a2", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 143.5, 120, 367, 128.5, 185.20000000000027, 367.0, 367.0, 0.1229987085135606, 0.09981633474098522, 0.04372219716692975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2689530-910a-47f1-aa84-74155d47b26b", 3, 0, 0.0, 491.6666666666667, 246, 825, 404.0, 825.0, 825.0, 825.0, 0.04082521365195144, 0.026246678698764358, 0.026180231410919387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 548.0416666666666, 151, 2403, 484.0, 920.5, 2054.0, 2403.0, 0.100488625943651, 0.061725923553277814, 0.045435775206943765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db1a4fb6-b40f-464a-bdbc-37ae15fb9d1e", 3, 0, 0.0, 319.6666666666667, 264, 417, 278.0, 417.0, 417.0, 417.0, 0.08339356201701228, 0.03773341510535387, 0.053478293350753325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af4a8f62-39d7-4aba-92f3-025023bf45e3", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afcfc162-ac42-41a2-8cb0-43ac8219e3d9", 3, 0, 0.0, 412.33333333333337, 201, 806, 230.0, 806.0, 806.0, 806.0, 0.07823297780791195, 0.03631517784963621, 0.05016893433645396], "isController": false}, {"data": ["login", 24, 5, 20.833333333333332, 2351.833333333334, 1384, 3907, 2173.0, 3756.5, 3898.25, 3907.0, 0.10267775015936442, 0.15280501441766742, 0.15416703209963165], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a95b9b17-a4ed-42b6-8d68-2770df84718f", 3, 0, 0.0, 352.3333333333333, 226, 461, 370.0, 461.0, 461.0, 461.0, 0.0235882436193801, 0.02381091909625576, 0.015126575498105078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2689530-910a-47f1-aa84-74155d47b26b", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8281164-d5f2-430b-b0c8-c7f5c7b99245", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 125.0, 121, 130, 124.0, 130.0, 130.0, 130.0, 0.03281978188910665, 0.01631373923980008, 0.016473992081055485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 197.66666666666666, 123, 387, 132.5, 382.5, 387.0, 387.0, 0.10062330547558487, 0.0814616408586522, 0.03576844061827431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 146.66666666666666, 119, 378, 128.5, 303.3000000000003, 378.0, 378.0, 0.056216621381055, 0.02794361355757519, 0.028218108779162372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afcfc162-ac42-41a2-8cb0-43ac8219e3d9", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.5681259827044025, 2.168091588050314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7287076e-c99e-4567-86eb-9933bd4b1f77", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4362e2c-2d51-4cd3-a36f-bc5395f16110", 3, 0, 0.0, 774.0, 219, 1666, 437.0, 1666.0, 1666.0, 1666.0, 0.08617965585590762, 0.040003967854988366, 0.055264948579472006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 177.17647058823528, 121, 436, 132.0, 383.99999999999994, 436.0, 436.0, 0.089528815112464, 0.0742284804985175, 0.031824695997008684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 141.86666666666665, 118, 379, 128.0, 231.4000000000001, 379.0, 379.0, 0.06730954763496687, 0.033457577877146615, 0.03378623777770798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8281164-d5f2-430b-b0c8-c7f5c7b99245", 3, 0, 0.0, 364.66666666666663, 195, 676, 223.0, 676.0, 676.0, 676.0, 0.02964778432225165, 0.029734643065383246, 0.019012413774360595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98f183b4-0b0b-45de-89b7-c60c912234b8", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 148.13333333333333, 122, 371, 133.0, 233.60000000000008, 371.0, 371.0, 0.06591436405821556, 0.051173749439727904, 0.023430496598818813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/621fe718-7ec1-4b7d-918f-f236186df2a2", 3, 0, 0.0, 331.6666666666667, 209, 422, 364.0, 422.0, 422.0, 422.0, 0.023863880426049814, 0.023933794138235504, 0.01530333477842387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4362e2c-2d51-4cd3-a36f-bc5395f16110", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, 100.0, 125.5, 118, 139, 124.0, 133.60000000000002, 139.0, 139.0, 0.11936339522546419, 0.05933200016578249, 0.059914829244031825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 124.85714285714286, 119, 133, 123.0, 133.0, 133.0, 133.0, 0.04433662902275736, 0.022038422043538567, 0.025112543782421157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db1a4fb6-b40f-464a-bdbc-37ae15fb9d1e", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15df6eda-554c-4d4b-8baf-5c6d8bc56242", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86c19ee3-95f5-497f-8670-7f37d6ae6459", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e992b797-3c0c-478b-8e98-62177a79f198", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15df6eda-554c-4d4b-8baf-5c6d8bc56242", 3, 0, 0.0, 344.6666666666667, 236, 432, 366.0, 432.0, 432.0, 432.0, 0.07402655085624044, 0.03349508648768691, 0.04747145351132606], "isController": false}, {"data": ["register", 27, 5, 18.51851851851852, 929.2222222222223, 191, 1644, 923.0, 1602.0, 1636.8, 1644.0, 0.10874993958336689, 0.03455076205513219, 0.04906491414796436], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.4630541871921183, 0.7923930269413629], "isController": false}, {"data": ["401/Unauthorized", 15, 7.389162561576355, 2.3771790808240887], "isController": false}, {"data": ["404/Not Found", 183, 90.14778325123153, 29.001584786053883], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 631, 203, "404/Not Found", 183, "401/Unauthorized", 15, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
