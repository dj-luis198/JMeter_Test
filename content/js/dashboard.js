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

    var data = {"OkPercent": 65.58641975308642, "KoPercent": 34.41358024691358};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5051136363636364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b9c8e3e-4e9e-4c5a-94ef-b89da3176cb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa8fd459-3134-4641-a26f-81d7fe1e2fe1"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57b5a95f-ffb0-453f-8f35-b268822a126c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5764d49-d80f-4099-87c3-394e42114d50"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7af96114-ac70-4332-acc3-679bccfaccf4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6034bde5-52cd-4004-95a6-b918d18c91e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5764d49-d80f-4099-87c3-394e42114d50"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b5aa06a-e36e-4c21-a286-f02904c85e38"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dadbe2c-8504-4c0a-ab47-52c2c33a286b"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6034bde5-52cd-4004-95a6-b918d18c91e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac0c492d-44fe-4cc6-93b2-64486bd26538"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c17b8d8-49ae-439c-9d27-43018db94960"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8804347826086957, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa8fd459-3134-4641-a26f-81d7fe1e2fe1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c17b8d8-49ae-439c-9d27-43018db94960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b57711b-96dc-401d-8fcb-977221ca33e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85c4fda2-cffe-45a7-baa7-2f466db41138"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5347d1bb-74e9-4cf9-ad83-fca48f72d199"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/195aaeca-0033-490a-a33c-0db8709b4564"], "isController": false}, {"data": [0.84, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5837c90-35a0-47f4-b480-a9aea079dda7"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf26ab4c-b07b-4bf2-9ff0-acea6b15c90e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9dadbe2c-8504-4c0a-ab47-52c2c33a286b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b5aa06a-e36e-4c21-a286-f02904c85e38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5347d1bb-74e9-4cf9-ad83-fca48f72d199"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7af96114-ac70-4332-acc3-679bccfaccf4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf26ab4c-b07b-4bf2-9ff0-acea6b15c90e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5837c90-35a0-47f4-b480-a9aea079dda7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b9c8e3e-4e9e-4c5a-94ef-b89da3176cb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57b5a95f-ffb0-453f-8f35-b268822a126c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afe48078-252d-4019-ad23-f8200b1dd4ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85c4fda2-cffe-45a7-baa7-2f466db41138"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afe48078-252d-4019-ad23-f8200b1dd4ae"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 648, 223, 34.41358024691358, 237.15586419753092, 81, 2094, 90.0, 514.9000000000002, 938.3999999999996, 1724.7499999999989, 2.5318532931675124, 2.649961575316775, 1.2120617302853414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9b9c8e3e-4e9e-4c5a-94ef-b89da3176cb8", 3, 0, 0.0, 248.66666666666666, 159, 340, 247.0, 340.0, 340.0, 340.0, 0.02593585199273796, 0.031111202667070112, 0.01663204050315553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa8fd459-3134-4641-a26f-81d7fe1e2fe1", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["see books", 60, 60, 100.0, 472.31666666666666, 336, 690, 509.5, 619.6, 628.95, 690.0, 0.26445698166431597, 1.7014303059436706, 0.44394682761812415], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 103.42105263157896, 83, 253, 85.0, 251.0, 253.0, 253.0, 0.10752383916697321, 0.05344690833592711, 0.05397192708185959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 121.09999999999998, 84, 261, 88.0, 253.8, 260.65, 261.0, 0.13188175481862963, 0.10238866707110404, 0.046879842533184744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57b5a95f-ffb0-453f-8f35-b268822a126c", 3, 0, 0.0, 368.6666666666667, 240, 503, 363.0, 503.0, 503.0, 503.0, 0.06519754857217368, 0.02950019287608119, 0.041809625874733775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5764d49-d80f-4099-87c3-394e42114d50", 3, 0, 0.0, 269.0, 175, 423, 209.0, 423.0, 423.0, 423.0, 0.0670630840076899, 0.031086533732731254, 0.04300594905441051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 113.21052631578948, 81, 253, 87.0, 252.0, 253.0, 253.0, 0.09286730240037537, 0.04616157902518659, 0.046615032650188425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 3.1712029569892475, 6.646925403225807], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 162.51666666666665, 83, 429, 87.0, 346.9, 350.95, 429.0, 0.2617207265367369, 0.13009360332734282, 0.12651539026922337], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 467.79999999999995, 84, 1072, 444.0, 761.2000000000002, 1072.0, 1072.0, 0.09856036165082036, 0.01855706809206852, 0.0666758279891715], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 467.79999999999995, 84, 1072, 444.0, 761.2000000000002, 1072.0, 1072.0, 0.10103187218794624, 0.019022407185386753, 0.06834779843131181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 880.64, 153, 2091, 751.0, 1973.8000000000004, 2086.8, 2091.0, 0.1121931517300184, 0.035112950455504194, 0.05061839462819189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7af96114-ac70-4332-acc3-679bccfaccf4", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6034bde5-52cd-4004-95a6-b918d18c91e5", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 87.375, 83, 94, 86.0, 94.0, 94.0, 94.0, 0.04646030547650851, 0.03656934200592369, 0.016515186712352633], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 497.8666666666666, 82, 1390, 449.0, 964.6000000000003, 1390.0, 1390.0, 0.10026067776218167, 0.02022837502506517, 0.06767595748947262], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5764d49-d80f-4099-87c3-394e42114d50", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1198.7600000000002, 725, 2094, 1123.0, 1790.0, 2004.6, 2094.0, 0.10834846600241833, 0.05607879588015793, 0.049836061999159215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b5aa06a-e36e-4c21-a286-f02904c85e38", 3, 0, 0.0, 529.6666666666666, 174, 1036, 379.0, 1036.0, 1036.0, 1036.0, 0.01919398076763127, 0.026460452002252093, 0.012308640010492708], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 195.39999999999998, 82, 326, 175.0, 313.40000000000003, 326.0, 326.0, 0.09780652565139146, 0.17297618940885737, 0.06267640833246393], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 85.5, 83, 90, 86.0, 90.0, 90.0, 90.0, 0.04766728236906393, 0.023693990943216347, 0.023926741345409043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dadbe2c-8504-4c0a-ab47-52c2c33a286b", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 521.8709677419356, 334, 1111, 513.0, 676.8, 705.85, 1111.0, 0.2760942461068485, 0.9417463058478542, 0.5371287269940016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6034bde5-52cd-4004-95a6-b918d18c91e5", 3, 0, 0.0, 363.0, 166, 471, 452.0, 471.0, 471.0, 471.0, 0.047640977592860206, 0.03062855818551397, 0.030551017531879755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac0c492d-44fe-4cc6-93b2-64486bd26538", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 88.42105263157895, 84, 100, 88.0, 92.0, 100.0, 100.0, 0.09840021958785845, 0.07351188279757004, 0.03497820305662156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c17b8d8-49ae-439c-9d27-43018db94960", 3, 0, 0.0, 253.66666666666669, 164, 406, 191.0, 406.0, 406.0, 406.0, 0.05333333333333333, 0.03491319444444444, 0.03420138888888889], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 419.46666666666664, 93, 855, 456.0, 690.0000000000001, 855.0, 855.0, 0.1014315370935131, 0.019097656593388013, 0.06945022627685399], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 21, 11.41304347826087, 140.64673913043478, 83, 846, 90.0, 276.0, 350.75, 575.7000000000019, 0.7576662233221193, 1.691511075721327, 0.3612562654158311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.22222222222223, 83, 255, 88.0, 255.0, 255.0, 255.0, 0.04815692737400275, 0.03729340176521893, 0.01711828277747754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa8fd459-3134-4641-a26f-81d7fe1e2fe1", 3, 0, 0.0, 601.3333333333333, 181, 1390, 233.0, 1390.0, 1390.0, 1390.0, 0.02515575605624827, 0.02522945456031931, 0.016131783668883168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, 100.0, 107.93333333333332, 83, 255, 86.0, 249.0, 255.0, 255.0, 0.06782051977646357, 0.03371156695919918, 0.03404272184092019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c17b8d8-49ae-439c-9d27-43018db94960", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 99.0, 85, 254, 89.0, 131.59999999999988, 254.0, 254.0, 0.09476823591716141, 0.0769066445773058, 0.03368714636117847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b57711b-96dc-401d-8fcb-977221ca33e1", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85c4fda2-cffe-45a7-baa7-2f466db41138", 3, 0, 0.0, 312.0, 161, 449, 326.0, 449.0, 449.0, 449.0, 0.020418163998693235, 0.028148087413563106, 0.013093679387182838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5347d1bb-74e9-4cf9-ad83-fca48f72d199", 3, 0, 0.0, 617.0, 305, 865, 681.0, 865.0, 865.0, 865.0, 0.03682743889714097, 0.030701520512883468, 0.02361655424067959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/195aaeca-0033-490a-a33c-0db8709b4564", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 398.96, 114, 834, 428.0, 619.4000000000001, 777.8999999999999, 834.0, 0.10695232920782549, 0.06569630378097874, 0.04835832853830391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5837c90-35a0-47f4-b480-a9aea079dda7", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["login", 25, 8, 32.0, 1890.32, 1190, 2801, 1810.0, 2653.6, 2759.2999999999997, 2801.0, 0.11196402819702087, 0.1688470028349292, 0.16767050581989018], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 85.66666666666667, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.048859139101969026, 0.02428642754189671, 0.024524997557043043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf26ab4c-b07b-4bf2-9ff0-acea6b15c90e", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 108.73684210526316, 86, 254, 88.0, 248.0, 254.0, 254.0, 0.10758959665226477, 0.08710134338352293, 0.038244739434984736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 85.44999999999999, 81, 90, 86.0, 88.0, 89.9, 90.0, 0.12400947432383833, 0.061641428155111054, 0.06224694316645792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dadbe2c-8504-4c0a-ab47-52c2c33a286b", 3, 0, 0.0, 247.33333333333331, 160, 413, 169.0, 413.0, 413.0, 413.0, 0.03282958164169795, 0.027368671414188944, 0.021052824164760727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b5aa06a-e36e-4c21-a286-f02904c85e38", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5347d1bb-74e9-4cf9-ad83-fca48f72d199", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 110.46666666666667, 85, 388, 89.0, 218.8000000000001, 388.0, 388.0, 0.07125992294426998, 0.05908171345672385, 0.025330675734095972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 85.6, 83, 88, 86.0, 88.0, 88.0, 88.0, 0.06848189338738837, 0.03404031614666082, 0.03437470039171643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7af96114-ac70-4332-acc3-679bccfaccf4", 3, 0, 0.0, 299.3333333333333, 177, 530, 191.0, 530.0, 530.0, 530.0, 0.055405754811066375, 0.03562056176818232, 0.03553038313079452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf26ab4c-b07b-4bf2-9ff0-acea6b15c90e", 3, 0, 0.0, 393.0, 175, 573, 431.0, 573.0, 573.0, 573.0, 0.060938452163315046, 0.0379080019804997, 0.0390783693885842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5837c90-35a0-47f4-b480-a9aea079dda7", 3, 0, 0.0, 250.66666666666666, 180, 374, 198.0, 374.0, 374.0, 374.0, 0.08856088560885608, 0.04007149446494465, 0.056791974169741695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 90.26666666666668, 85, 111, 88.0, 102.60000000000001, 111.0, 111.0, 0.06920830315082335, 0.05373105566885211, 0.024601389010644237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b9c8e3e-4e9e-4c5a-94ef-b89da3176cb8", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57b5a95f-ffb0-453f-8f35-b268822a126c", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 138.58823529411765, 83, 327, 86.0, 278.99999999999994, 327.0, 327.0, 0.10009420631182289, 0.04975385841085728, 0.050242599652614225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, 100.0, 100.69999999999999, 82, 252, 83.5, 235.70000000000005, 252.0, 252.0, 0.12951522451464167, 0.0643781731230006, 0.07316851306808615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afe48078-252d-4019-ad23-f8200b1dd4ae", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85c4fda2-cffe-45a7-baa7-2f466db41138", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afe48078-252d-4019-ad23-f8200b1dd4ae", 3, 0, 0.0, 627.3333333333334, 192, 1217, 473.0, 1217.0, 1217.0, 1217.0, 0.06429214350006429, 0.02909052065920878, 0.04122901129398654], "isController": false}, {"data": ["register", 25, 8, 32.0, 880.64, 153, 2091, 751.0, 1973.8000000000004, 2086.8, 2091.0, 0.1130638494170428, 0.03538545162224011, 0.051011228936204855], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.587443946188341, 1.2345679012345678], "isController": false}, {"data": ["401/Unauthorized", 23, 10.31390134529148, 3.549382716049383], "isController": false}, {"data": ["404/Not Found", 192, 86.09865470852019, 29.62962962962963], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 648, 223, "404/Not Found", 192, "401/Unauthorized", 23, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
