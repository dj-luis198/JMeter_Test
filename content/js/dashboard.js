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

    var data = {"OkPercent": 66.35658914728683, "KoPercent": 33.64341085271318};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49490373725934317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39f49e8d-0b9b-44f2-995e-69ce3a920d32"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=711a2146-e25d-494c-a49f-b95c1f9db816"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/711a2146-e25d-494c-a49f-b95c1f9db816"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d67e629-36ee-4a09-aa1f-d82f6bed6f13"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d82c5c3e-bf6d-43e4-bf8a-628bdac5af3b"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f15bc2f-99a0-421b-a462-26351a692307"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39f49e8d-0b9b-44f2-995e-69ce3a920d32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d67e629-36ee-4a09-aa1f-d82f6bed6f13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17021c48-799c-495f-bf7b-4f637c096642"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6967851-99cd-447f-beb5-221503f042ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8008bf31-866c-48c9-956a-d315fc0672c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd91cfc4-1a02-4c91-b443-9e783cfacc56"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9db0d7fe-3bf8-480c-8c8b-99f6489eef2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9181fa0d-e443-48f3-be64-ecf71fc140fe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f15bc2f-99a0-421b-a462-26351a692307"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8008bf31-866c-48c9-956a-d315fc0672c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9181fa0d-e443-48f3-be64-ecf71fc140fe"], "isController": false}, {"data": [0.9213483146067416, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5678b9d5-97a1-4f85-932c-f3e395491653"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9db0d7fe-3bf8-480c-8c8b-99f6489eef2d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bc7405e-95a5-4639-90c3-4d0f271f604a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e149abf8-bdd4-4456-b793-3dda6c250123"], "isController": false}, {"data": [0.78, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.06, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd91cfc4-1a02-4c91-b443-9e783cfacc56"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc95c26b-1adf-4991-bcb2-8d8bca2bda4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17021c48-799c-495f-bf7b-4f637c096642"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d82c5c3e-bf6d-43e4-bf8a-628bdac5af3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e149abf8-bdd4-4456-b793-3dda6c250123"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9388d78c-bef4-4286-a1ed-fd8a7966b267"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc95c26b-1adf-4991-bcb2-8d8bca2bda4a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bc7405e-95a5-4639-90c3-4d0f271f604a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae16db4f-0fa1-4449-96da-946ae2d3195d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9388d78c-bef4-4286-a1ed-fd8a7966b267"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41bc424e-756a-41d5-9a30-d7273235aa77"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 645, 217, 33.64341085271318, 306.09612403100806, 127, 1892, 145.0, 670.3999999999993, 1073.5999999999988, 1535.3999999999996, 2.501250625312656, 2.6295889284273923, 1.2019053070624461], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/39f49e8d-0b9b-44f2-995e-69ce3a920d32", 3, 0, 0.0, 291.3333333333333, 223, 408, 243.0, 408.0, 408.0, 408.0, 0.04122521334047904, 0.025644981345590963, 0.026436741627846257], "isController": false}, {"data": ["see books", 60, 60, 100.0, 748.5666666666667, 530, 1081, 800.0, 972.1, 1030.4999999999998, 1081.0, 0.26700724924681707, 1.7175076166599175, 0.44822798970242045], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 167.8235294117647, 132, 396, 137.0, 395.2, 396.0, 396.0, 0.09027139830395972, 0.04487123216476123, 0.045312010476792286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 191.00000000000003, 128, 412, 142.0, 398.8, 412.0, 412.0, 0.092225965913283, 0.07160121377056639, 0.03278344882073732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 23, 100.0, 146.69565217391303, 127, 397, 135.0, 147.60000000000002, 347.5999999999993, 397.0, 0.12319954576863124, 0.06123883671507159, 0.061840396997144984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=711a2146-e25d-494c-a49f-b95c1f9db816", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/711a2146-e25d-494c-a49f-b95c1f9db816", 3, 0, 0.0, 353.3333333333333, 221, 425, 414.0, 425.0, 425.0, 425.0, 0.022925263640531865, 0.0270968855074125, 0.01470142232156503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d67e629-36ee-4a09-aa1f-d82f6bed6f13", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 134.0, 130, 140, 132.0, 140.0, 140.0, 140.0, 0.028283475850625534, 0.008341415729383702, 0.017483828333443325], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 247.29999999999998, 129, 650, 139.0, 543.6999999999999, 562.5, 650.0, 0.2619458208727162, 0.13020549103927004, 0.1266242005195259], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 501.9411764705883, 132, 992, 474.0, 773.5999999999998, 992.0, 992.0, 0.08579402368924395, 0.01722977405891526, 0.05758864699039611], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 501.9411764705883, 132, 992, 474.0, 773.5999999999998, 992.0, 992.0, 0.08608553864227914, 0.01728831819240624, 0.05778432439309695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d82c5c3e-bf6d-43e4-bf8a-628bdac5af3b", 3, 0, 0.0, 424.66666666666663, 224, 804, 246.0, 804.0, 804.0, 804.0, 0.022755026964706954, 0.026843820872427735, 0.01459225361994554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 981.6153846153844, 146, 1892, 919.5, 1633.4, 1820.5999999999997, 1892.0, 0.10443906181587394, 0.03273135260635712, 0.04711996734270874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f15bc2f-99a0-421b-a462-26351a692307", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39f49e8d-0b9b-44f2-995e-69ce3a920d32", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d67e629-36ee-4a09-aa1f-d82f6bed6f13", 3, 0, 0.0, 395.0, 287, 589, 309.0, 589.0, 589.0, 589.0, 0.03903505347802327, 0.03254191795482343, 0.025032244580633408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 179.87499999999997, 129, 449, 143.0, 449.0, 449.0, 449.0, 0.040565688526502074, 0.031929633742539716, 0.014419834593405033], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 485.82352941176464, 129, 1061, 444.0, 855.3999999999999, 1061.0, 1061.0, 0.08513024928140055, 0.020133343077408435, 0.056668734413652895], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1210.4400000000003, 722, 1720, 1255.0, 1554.4, 1681.3, 1720.0, 0.10247707587812606, 0.053039892788483214, 0.0471354518931615], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 252.88235294117644, 132, 425, 241.0, 377.79999999999995, 425.0, 425.0, 0.08617674343155793, 0.14992812796232555, 0.05441986101465512], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/17021c48-799c-495f-bf7b-4f637c096642", 3, 0, 0.0, 309.3333333333333, 241, 424, 263.0, 424.0, 424.0, 424.0, 0.03392091903076627, 0.028278474491468888, 0.021752672685745298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 229.375, 129, 608, 140.5, 608.0, 608.0, 608.0, 0.040769940322999854, 0.020265526976959887, 0.020464598951193284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6967851-99cd-447f-beb5-221503f042ad", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.6694673742138365, 1.2509008123689729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8008bf31-866c-48c9-956a-d315fc0672c1", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd91cfc4-1a02-4c91-b443-9e783cfacc56", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 810.0677966101696, 522, 1242, 789.0, 1142.0, 1201.0, 1242.0, 0.2657873160886919, 0.9282363336329071, 0.5182403936467822], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9db0d7fe-3bf8-480c-8c8b-99f6489eef2d", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 0.6002128322259136, 2.290541943521595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9181fa0d-e443-48f3-be64-ecf71fc140fe", 3, 0, 0.0, 380.3333333333333, 319, 492, 330.0, 492.0, 492.0, 492.0, 0.034147951692031005, 0.028134266188974768, 0.021898263292090197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f15bc2f-99a0-421b-a462-26351a692307", 3, 0, 0.0, 361.0, 208, 658, 217.0, 658.0, 658.0, 658.0, 0.02677161138328916, 0.02685004383851364, 0.01716799297691395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8008bf31-866c-48c9-956a-d315fc0672c1", 3, 0, 0.0, 340.0, 223, 444, 353.0, 444.0, 444.0, 444.0, 0.04982726547967048, 0.03261804390612543, 0.03195303157387722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 165.65217391304344, 127, 432, 140.0, 314.00000000000034, 425.9999999999999, 432.0, 0.12093233572919569, 0.09034495784456514, 0.042987666216237536], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 455.5882352941177, 130, 823, 450.0, 783.8, 823.0, 823.0, 0.0860141063134354, 0.017273972637394885, 0.05822060056819907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9181fa0d-e443-48f3-be64-ecf71fc140fe", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, 6.179775280898877, 218.2528089887641, 128, 810, 147.0, 421.29999999999995, 476.9499999999997, 750.7500000000006, 0.732655010043136, 1.6844087257976885, 0.3487338484042115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 147.85714285714286, 138, 176, 143.0, 176.0, 176.0, 176.0, 0.03225419995760877, 0.024978106021859132, 0.011465360141181241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5678b9d5-97a1-4f85-932c-f3e395491653", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 133.8571428571429, 128, 142, 132.5, 140.0, 142.0, 142.0, 0.06729378061266181, 0.03344974055844224, 0.03377832347159001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 167.05000000000004, 130, 421, 139.5, 374.0000000000005, 419.84999999999997, 421.0, 0.10046919112254228, 0.08153310334260999, 0.0357136577818412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9db0d7fe-3bf8-480c-8c8b-99f6489eef2d", 3, 0, 0.0, 615.3333333333334, 235, 869, 742.0, 869.0, 869.0, 869.0, 0.08404538450763412, 0.03802834780781622, 0.0538962914974086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bc7405e-95a5-4639-90c3-4d0f271f604a", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e149abf8-bdd4-4456-b793-3dda6c250123", 3, 0, 0.0, 307.0, 234, 419, 268.0, 419.0, 419.0, 419.0, 0.031242189452636845, 0.031150659600724818, 0.020034867585187036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 527.92, 157, 1147, 466.0, 981.2000000000004, 1130.2, 1147.0, 0.10325245224574084, 0.06342362545172948, 0.04668543495095508], "isController": false}, {"data": ["login", 25, 7, 28.0, 2014.6399999999999, 1332, 3049, 2069.0, 2737.4000000000005, 3006.1, 3049.0, 0.10261082995743703, 0.15401244258924063, 0.1538080225764348], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd91cfc4-1a02-4c91-b443-9e783cfacc56", 3, 0, 0.0, 391.6666666666667, 294, 515, 366.0, 515.0, 515.0, 515.0, 0.03647061683969949, 0.03040405264533541, 0.02338773280410416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 137.42857142857142, 132, 148, 134.0, 148.0, 148.0, 148.0, 0.031413518583340065, 0.015614727498945402, 0.01576811382015312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 202.58823529411768, 133, 428, 143.0, 406.4, 428.0, 428.0, 0.08845505442587466, 0.07161058605375986, 0.03144300762794763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 137.13333333333333, 129, 155, 134.0, 151.4, 155.0, 155.0, 0.089122852881936, 0.04430032433291545, 0.04473549451300303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc95c26b-1adf-4991-bcb2-8d8bca2bda4a", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17021c48-799c-495f-bf7b-4f637c096642", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d82c5c3e-bf6d-43e4-bf8a-628bdac5af3b", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e149abf8-bdd4-4456-b793-3dda6c250123", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9388d78c-bef4-4286-a1ed-fd8a7966b267", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 162.35714285714286, 132, 415, 143.5, 292.5, 415.0, 415.0, 0.06562664066601666, 0.05441115031782044, 0.023328219924248106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 151.60000000000002, 130, 387, 133.0, 241.80000000000007, 387.0, 387.0, 0.07346962765592704, 0.0365195707781903, 0.036878309194479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc95c26b-1adf-4991-bcb2-8d8bca2bda4a", 3, 0, 0.0, 377.6666666666667, 227, 499, 407.0, 499.0, 499.0, 499.0, 0.037404618223529994, 0.03118269116876964, 0.023986685514438184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bc7405e-95a5-4639-90c3-4d0f271f604a", 3, 0, 0.0, 531.3333333333333, 228, 1061, 305.0, 1061.0, 1061.0, 1061.0, 0.023323796492101007, 0.02339212792713646, 0.01495699189109342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 140.0666666666667, 130, 153, 140.0, 150.6, 153.0, 153.0, 0.07267864410721553, 0.05642531451683237, 0.025834986772486773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae16db4f-0fa1-4449-96da-946ae2d3195d", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 1.1126687717770036, 2.0790233013937285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9388d78c-bef4-4286-a1ed-fd8a7966b267", 3, 0, 0.0, 335.6666666666667, 250, 484, 273.0, 484.0, 484.0, 484.0, 0.0988793671720501, 0.043774719841793014, 0.06340896918259724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 153.84615384615387, 127, 412, 132.0, 302.7999999999999, 412.0, 412.0, 0.05663303535643961, 0.028150600582448986, 0.032247476562636136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 20, 100.0, 174.2, 127, 393, 137.5, 390.6, 392.9, 393.0, 0.09967058870433218, 0.049543290674321366, 0.05002996347072924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41bc424e-756a-41d5-9a30-d7273235aa77", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 981.6153846153844, 146, 1892, 919.5, 1633.4, 1820.5999999999997, 1892.0, 0.10554218236877251, 0.033077072178674796, 0.04761766431091103], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.686635944700461, 1.2403100775193798], "isController": false}, {"data": ["401/Unauthorized", 17, 7.8341013824884795, 2.635658914728682], "isController": false}, {"data": ["404/Not Found", 192, 88.47926267281106, 29.767441860465116], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 645, 217, "404/Not Found", 192, "401/Unauthorized", 17, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
