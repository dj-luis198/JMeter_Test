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

    var data = {"OkPercent": 66.71974522292993, "KoPercent": 33.28025477707006};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4918032786885246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/134f67de-c3e9-4305-bd0a-da03615d406b"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9afa3cbc-9bea-4654-b0e0-2b1954e3065c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48512e96-10db-41a4-a4ed-cc646971c98e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23d1770b-a3fb-43bf-813b-3d4b9a4d5554"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41eca2e7-f0d9-4a08-92cf-cec8acaf1d88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c009e7b2-51a4-43a4-80aa-20f2a7bca402"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=212dff1b-9cb9-4ea5-8c84-29586325c1da"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/045be21c-4202-46e6-aa9c-abf784ecee06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df2e320d-a0ff-431c-a079-c6337bcac6f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=045be21c-4202-46e6-aa9c-abf784ecee06"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df2e320d-a0ff-431c-a079-c6337bcac6f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad55182f-7279-4d83-ae77-3e5531aa20b8"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23d1770b-a3fb-43bf-813b-3d4b9a4d5554"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d007ce68-6802-469c-b165-56290a8bf163"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=134f67de-c3e9-4305-bd0a-da03615d406b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9410112359550562, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad55182f-7279-4d83-ae77-3e5531aa20b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce57a9f1-e827-4f24-9be7-2be2e107c5e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d007ce68-6802-469c-b165-56290a8bf163"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f5c1126-c69e-4a2e-be7b-6fb822d264d6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b576b686-a9b5-4ff5-a2d8-7067288fdc94"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ea237c5-50c7-4d3c-9c62-c755b38732b4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbfe48f2-5444-4267-9c03-a4355ac41560"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/212dff1b-9cb9-4ea5-8c84-29586325c1da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f5c1126-c69e-4a2e-be7b-6fb822d264d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48512e96-10db-41a4-a4ed-cc646971c98e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b27909b-ba22-4359-be17-c6613baf75ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce57a9f1-e827-4f24-9be7-2be2e107c5e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b27909b-ba22-4359-be17-c6613baf75ee"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 628, 209, 33.28025477707006, 293.77707006369434, 121, 1720, 132.0, 739.4000000000003, 1087.8499999999997, 1407.8400000000001, 2.4571755002386744, 2.564629548024478, 1.177405509521555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/134f67de-c3e9-4305-bd0a-da03615d406b", 3, 0, 0.0, 362.0, 300, 395, 391.0, 395.0, 395.0, 395.0, 0.018345706493157053, 0.025291037434414097, 0.011764662041510218], "isController": false}, {"data": ["see books", 58, 58, 100.0, 699.0344827586206, 500, 1321, 758.0, 909.5, 923.0999999999997, 1321.0, 0.2617269465941653, 1.6848539983867694, 0.4393638878861037], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 161.73333333333335, 121, 381, 128.0, 379.8, 381.0, 381.0, 0.08703371686191232, 0.04326187683858727, 0.04368684615920207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 146.13333333333333, 122, 378, 128.0, 234.60000000000008, 378.0, 378.0, 0.16988312041315576, 0.13189168039888555, 0.060388140459363956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9afa3cbc-9bea-4654-b0e0-2b1954e3065c", 2, 0, 0.0, 331.0, 201, 461, 331.0, 461.0, 461.0, 461.0, 0.01952076521399639, 0.027432012834903128, 0.012133756893270217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48512e96-10db-41a4-a4ed-cc646971c98e", 3, 0, 0.0, 611.0, 213, 1405, 215.0, 1405.0, 1405.0, 1405.0, 0.030248033877797943, 0.030336651164549304, 0.0193973394333535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23d1770b-a3fb-43bf-813b-3d4b9a4d5554", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 142.75, 123, 375, 128.0, 205.60000000000016, 375.0, 375.0, 0.10234170616416889, 0.05087102386480661, 0.051370739226936336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41eca2e7-f0d9-4a08-92cf-cec8acaf1d88", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c009e7b2-51a4-43a4-80aa-20f2a7bca402", 2, 0, 0.0, 326.5, 226, 427, 326.5, 427.0, 427.0, 427.0, 0.01915103463464614, 0.02726778173565827, 0.011903939008742447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 132.33333333333334, 128, 138, 131.0, 138.0, 138.0, 138.0, 0.04316795211235179, 0.012731173376885, 0.02668487664757684], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 225.58620689655172, 121, 784, 129.0, 508.2, 526.7499999999998, 784.0, 0.24349695208987557, 0.12103510606811198, 0.11770604617625821], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 558.5333333333333, 126, 1256, 529.0, 1002.2000000000002, 1256.0, 1256.0, 0.07802908924447034, 0.01588013886576916, 0.052288633827690965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 558.5333333333333, 126, 1256, 529.0, 1002.2000000000002, 1256.0, 1256.0, 0.07697281320237692, 0.015665170186889992, 0.05158080509713969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 994.1249999999998, 165, 1543, 1038.0, 1467.5, 1540.75, 1543.0, 0.10646462047580814, 0.033426147932590154, 0.04803384244123375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=212dff1b-9cb9-4ea5-8c84-29586325c1da", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/045be21c-4202-46e6-aa9c-abf784ecee06", 3, 0, 0.0, 493.33333333333337, 220, 752, 508.0, 752.0, 752.0, 752.0, 0.032136774110614774, 0.026791106281668114, 0.020608543293590856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 149.71428571428572, 124, 275, 129.0, 275.0, 275.0, 275.0, 0.045795933321121085, 0.03604640845392929, 0.01627902317274226], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 513.9285714285714, 123, 1405, 425.0, 1156.0, 1405.0, 1405.0, 0.08912712711438193, 0.022145007448481337, 0.059042991504274916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df2e320d-a0ff-431c-a079-c6337bcac6f3", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=045be21c-4202-46e6-aa9c-abf784ecee06", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1149.2916666666663, 788, 1720, 1136.0, 1563.5, 1698.75, 1720.0, 0.1070048018404826, 0.05538334470259353, 0.0492180289715501], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 241.11764705882356, 124, 468, 220.0, 462.4, 468.0, 468.0, 0.08711426316706465, 0.15472189732302996, 0.05501189654156376], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 162.28571428571428, 127, 363, 129.0, 363.0, 363.0, 363.0, 0.04450406576429375, 0.02212164987697805, 0.022338954885592763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df2e320d-a0ff-431c-a079-c6337bcac6f3", 3, 0, 0.0, 365.6666666666667, 220, 479, 398.0, 479.0, 479.0, 479.0, 0.08106355382619974, 0.03667914707630782, 0.05198411492109814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad55182f-7279-4d83-ae77-3e5531aa20b8", 1, 0, 0.0, 924.0, 924, 924, 924.0, 924.0, 924.0, 924.0, 1.0822510822510822, 0.19552387716450215, 0.7461613906926406], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 752.8000000000002, 490, 1539, 695.0, 976.3, 1175.2999999999997, 1539.0, 0.28784295288490597, 0.9541356735764966, 0.5625446381454279], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23d1770b-a3fb-43bf-813b-3d4b9a4d5554", 3, 0, 0.0, 411.0, 213, 688, 332.0, 688.0, 688.0, 688.0, 0.024520621842969936, 0.02459245960227551, 0.015724487314664966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d007ce68-6802-469c-b165-56290a8bf163", 3, 0, 0.0, 748.3333333333334, 223, 1115, 907.0, 1115.0, 1115.0, 1115.0, 0.06823920114641858, 0.030876461456224552, 0.04376016479767077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=134f67de-c3e9-4305-bd0a-da03615d406b", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 145.1875, 125, 385, 129.0, 210.70000000000016, 385.0, 385.0, 0.10726304922033171, 0.0801330397007361, 0.03812866202753979], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 503.57142857142856, 128, 1154, 517.5, 1039.0, 1154.0, 1154.0, 0.09095043201455207, 0.01865828826414604, 0.061316680065614235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, 3.932584269662921, 204.57865168539337, 123, 1121, 133.0, 376.2, 471.09999999999997, 1070.4400000000005, 0.734178050551046, 1.6143442356711541, 0.3522944546356332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 152.83333333333334, 122, 382, 133.5, 309.7000000000003, 382.0, 382.0, 0.05853201701330628, 0.04532801708159363, 0.020806302922698718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, 100.0, 170.83333333333334, 121, 406, 127.0, 387.1, 406.0, 406.0, 0.08754991561160912, 0.043518463912411175, 0.04394595373473348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 165.95238095238093, 122, 382, 131.0, 372.2, 381.2, 382.0, 0.1594835769887982, 0.12942466062274538, 0.05669142775773685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad55182f-7279-4d83-ae77-3e5531aa20b8", 3, 0, 0.0, 535.0, 320, 878, 407.0, 878.0, 878.0, 878.0, 0.06291022710591986, 0.04044521436659886, 0.04034282141883532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce57a9f1-e827-4f24-9be7-2be2e107c5e8", 3, 0, 0.0, 336.3333333333333, 224, 416, 369.0, 416.0, 416.0, 416.0, 0.047621315300728606, 0.03061591722621712, 0.03053840857501151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d007ce68-6802-469c-b165-56290a8bf163", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 512.0833333333334, 146, 1286, 582.5, 775.5, 1158.75, 1286.0, 0.10786613812258987, 0.06625761804600491, 0.048771505811288196], "isController": false}, {"data": ["login", 24, 7, 29.166666666666668, 2008.2916666666667, 1122, 2953, 1950.0, 2643.0, 2902.25, 2953.0, 0.10635610683470932, 0.159854405690938, 0.1593783651736928], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f5c1126-c69e-4a2e-be7b-6fb822d264d6", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b576b686-a9b5-4ff5-a2d8-7067288fdc94", 2, 0, 0.0, 361.0, 201, 521, 361.0, 521.0, 521.0, 521.0, 0.07913896802785692, 0.04865037145853118, 0.04919136049778411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 169.83333333333334, 121, 379, 128.0, 379.0, 379.0, 379.0, 0.05806498439503544, 0.028862379938547893, 0.029145900370164277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 163.86666666666667, 121, 381, 131.0, 378.0, 381.0, 381.0, 0.08642693754789492, 0.06996868283906729, 0.030722075456478277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ea237c5-50c7-4d3c-9c62-c755b38732b4", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.8064038825757576, 1.5067668876262625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 126.06666666666666, 122, 130, 126.0, 128.8, 130.0, 130.0, 0.17252087502587812, 0.08575500526188669, 0.08659739234697399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbfe48f2-5444-4267-9c03-a4355ac41560", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/212dff1b-9cb9-4ea5-8c84-29586325c1da", 3, 0, 0.0, 320.3333333333333, 220, 443, 298.0, 443.0, 443.0, 443.0, 0.028930999566035006, 0.029015758353826127, 0.01855275688316698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 147.2777777777778, 122, 381, 130.0, 194.7000000000003, 381.0, 381.0, 0.08931362479346223, 0.07405006586879828, 0.031748202563301034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, 100.0, 127.57142857142857, 122, 134, 127.5, 131.5, 134.0, 134.0, 0.06372964065586904, 0.03167811239632553, 0.031989292282340515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f5c1126-c69e-4a2e-be7b-6fb822d264d6", 3, 0, 0.0, 354.3333333333333, 210, 491, 362.0, 491.0, 491.0, 491.0, 0.020393319148646904, 0.028113836782070193, 0.013077746980089323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 151.57142857142856, 125, 376, 130.5, 271.5, 376.0, 376.0, 0.06551393340976625, 0.05086286822340252, 0.02328815601675285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48512e96-10db-41a4-a4ed-cc646971c98e", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b27909b-ba22-4359-be17-c6613baf75ee", 3, 0, 0.0, 417.3333333333333, 221, 563, 468.0, 563.0, 563.0, 563.0, 0.05420445922017851, 0.034354193392476425, 0.034760021049398335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce57a9f1-e827-4f24-9be7-2be2e107c5e8", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b27909b-ba22-4359-be17-c6613baf75ee", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 0.15655464688041595, 0.5974463821490469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, 100.0, 164.95238095238096, 121, 389, 129.0, 383.2, 388.6, 389.0, 0.15600160458793288, 0.07754376634302523, 0.07830549292792725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 144.6153846153846, 122, 367, 127.0, 271.79999999999995, 367.0, 367.0, 0.09393945963132375, 0.046694516555023234, 0.0534901670677159], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 994.1249999999998, 165, 1543, 1038.0, 1467.5, 1540.75, 1543.0, 0.10618670277014562, 0.03333889154355646, 0.04790845378887429], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.349282296650718, 1.1146496815286624], "isController": false}, {"data": ["401/Unauthorized", 13, 6.220095693779904, 2.070063694267516], "isController": false}, {"data": ["404/Not Found", 189, 90.43062200956938, 30.095541401273884], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 628, 209, "404/Not Found", 189, "401/Unauthorized", 13, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
