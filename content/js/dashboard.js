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

    var data = {"OkPercent": 66.44628099173553, "KoPercent": 33.553719008264466};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5018270401948843, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef25eef2-9209-4b9a-a97f-4bf549bce6e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f8102c4-e8a6-483b-8ef2-c66d1da9aed7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13d4891a-8ba5-4785-8975-1756dd9c4e47"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f15d101c-8743-4142-9384-20ae1173aff9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0798f8f9-6d8b-43fc-a82b-aaf9d30312a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abf36f53-2685-44f8-a006-301adceb52fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5eb1fcbe-63e2-4ccd-b976-f7c5414c12b0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f8102c4-e8a6-483b-8ef2-c66d1da9aed7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13d4891a-8ba5-4785-8975-1756dd9c4e47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeebd878-9455-41db-b0e5-42b44cc81d94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fda5370f-71ed-4bbd-8428-4d51d2d39bed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fda5370f-71ed-4bbd-8428-4d51d2d39bed"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/170c7524-121b-4c8c-9969-e578a0f8c098"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5eb1fcbe-63e2-4ccd-b976-f7c5414c12b0"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef25eef2-9209-4b9a-a97f-4bf549bce6e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf8f62ba-e700-4073-9c80-2ca788497df6"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf8f62ba-e700-4073-9c80-2ca788497df6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e704efc0-b87e-49be-9bee-81845aad4104"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4dd2d387-243a-4af3-9741-d14b3d641ce0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=170c7524-121b-4c8c-9969-e578a0f8c098"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4dd2d387-243a-4af3-9741-d14b3d641ce0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07afdaab-52d6-430c-bd19-8b134440ab35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e704efc0-b87e-49be-9bee-81845aad4104"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07afdaab-52d6-430c-bd19-8b134440ab35"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abf36f53-2685-44f8-a006-301adceb52fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc0268fa-d606-44ca-87d7-edc23ef9795c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0798f8f9-6d8b-43fc-a82b-aaf9d30312a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87429cb9-bdbf-4e33-9184-042e2e7720d2"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 605, 203, 33.553719008264466, 286.49090909090904, 117, 2164, 131.0, 597.1999999999998, 982.0, 1459.0, 2.3885287452525525, 2.5014086274250475, 1.143515076600709], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ef25eef2-9209-4b9a-a97f-4bf549bce6e3", 3, 0, 0.0, 293.6666666666667, 202, 397, 282.0, 397.0, 397.0, 397.0, 0.022339546209351333, 0.026404587332732647, 0.014325815765762412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f8102c4-e8a6-483b-8ef2-c66d1da9aed7", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13d4891a-8ba5-4785-8975-1756dd9c4e47", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["see books", 56, 56, 100.0, 703.2142857142857, 494, 952, 754.5, 901.9, 907.45, 952.0, 0.25255486303408586, 1.6259980990736649, 0.4239666108941344], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 181.85000000000002, 122, 499, 127.5, 376.0, 492.8499999999999, 499.0, 0.10732262253560429, 0.05334688952209236, 0.053870925764941985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 148.46153846153845, 118, 364, 130.0, 275.9999999999999, 364.0, 364.0, 0.0881087125961571, 0.06840471339252432, 0.03131989393066523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f15d101c-8743-4142-9384-20ae1173aff9", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 141.56250000000003, 118, 366, 127.0, 202.90000000000015, 366.0, 366.0, 0.09128824834967963, 0.045376678134752865, 0.04582242153489778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0798f8f9-6d8b-43fc-a82b-aaf9d30312a2", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abf36f53-2685-44f8-a006-301adceb52fe", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5eb1fcbe-63e2-4ccd-b976-f7c5414c12b0", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 131.5, 131, 132, 131.5, 132.0, 132.0, 132.0, 0.08719155985700584, 0.025714698317202897, 0.053898688856918654], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 215.35714285714286, 118, 513, 128.0, 507.0, 510.3, 513.0, 0.2652582715581555, 0.13185201193662222, 0.12822543400516306], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 526.7142857142857, 129, 1129, 429.0, 1114.0, 1129.0, 1129.0, 0.08294035403682552, 0.016338138936941634, 0.055806546807981236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 526.7142857142857, 129, 1129, 429.0, 1114.0, 1129.0, 1129.0, 0.08426780307818248, 0.016599628619753577, 0.05669972296959738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 969.7391304347826, 225, 1870, 940.0, 1646.8000000000004, 1850.3999999999996, 1870.0, 0.09514275549966493, 0.02997449243408262, 0.04292573539145039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f8102c4-e8a6-483b-8ef2-c66d1da9aed7", 3, 0, 0.0, 526.0, 194, 965, 419.0, 965.0, 965.0, 965.0, 0.024279505669264574, 0.024350637033529996, 0.015569865289209377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13d4891a-8ba5-4785-8975-1756dd9c4e47", 3, 0, 0.0, 383.6666666666667, 292, 559, 300.0, 559.0, 559.0, 559.0, 0.025545176644896497, 0.025786325773380223, 0.01638150976251501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeebd878-9455-41db-b0e5-42b44cc81d94", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 1.0824947033898307, 2.0226430084745766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fda5370f-71ed-4bbd-8428-4d51d2d39bed", 3, 0, 0.0, 392.3333333333333, 275, 467, 435.0, 467.0, 467.0, 467.0, 0.0777665448324131, 0.036554326412110844, 0.049869822044223244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fda5370f-71ed-4bbd-8428-4d51d2d39bed", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 525.5, 127, 1459, 477.5, 1084.5, 1459.0, 1459.0, 0.08642668856142777, 0.019520760153592574, 0.057778556303900934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 136.5, 128, 149, 135.5, 149.0, 149.0, 149.0, 0.06575270407995529, 0.051754569812933554, 0.023373031528421604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1165.1363636363637, 712, 2164, 1050.5, 1783.5999999999997, 2125.7499999999995, 2164.0, 0.0922052992900192, 0.047723445921591966, 0.04241083590390531], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 224.5, 126, 389, 213.5, 344.5, 389.0, 389.0, 0.08294919954022444, 0.15938906248148457, 0.052618584027539134], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 126.5, 123, 129, 127.5, 129.0, 129.0, 129.0, 0.0605999394000606, 0.030122430815069184, 0.030418328956671042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/170c7524-121b-4c8c-9969-e578a0f8c098", 3, 0, 0.0, 303.3333333333333, 222, 453, 235.0, 453.0, 453.0, 453.0, 0.03722269095240459, 0.031031025888381556, 0.02387001991413966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5eb1fcbe-63e2-4ccd-b976-f7c5414c12b0", 3, 0, 0.0, 349.0, 218, 576, 253.0, 576.0, 576.0, 576.0, 0.045262522631261314, 0.02909944081925166, 0.029025771348823174], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 754.1355932203389, 498, 1632, 701.0, 970.0, 1176.0, 1632.0, 0.2783491536298617, 0.9305134436154253, 0.5430563606909664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef25eef2-9209-4b9a-a97f-4bf549bce6e3", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 173.9375, 127, 364, 131.5, 362.6, 364.0, 364.0, 0.09097473745259363, 0.06796452553831459, 0.03233867620385165], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 417.92857142857144, 131, 751, 404.5, 685.0, 751.0, 751.0, 0.08437496233260611, 0.016620737557706447, 0.057313294028663385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bf8f62ba-e700-4073-9c80-2ca788497df6", 3, 0, 0.0, 311.3333333333333, 201, 502, 231.0, 502.0, 502.0, 502.0, 0.041813012209399564, 0.02688173799269666, 0.026813682959803756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 200.35057471264372, 118, 1239, 131.0, 381.0, 476.25, 918.75, 0.7311077963822769, 1.6038734729195991, 0.35060561277547847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 132.0, 131, 135, 131.0, 135.0, 135.0, 135.0, 0.026004285506251428, 0.02013808438130604, 0.009243710863550313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf8f62ba-e700-4073-9c80-2ca788497df6", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, 100.0, 162.00000000000006, 125, 379, 128.0, 377.8, 379.0, 379.0, 0.08944117156009254, 0.044458551097741314, 0.04489527556824958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 155.33333333333334, 122, 388, 130.0, 335.60000000000014, 387.6, 388.0, 0.09995716121662145, 0.08111757907325431, 0.0355316471512209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e704efc0-b87e-49be-9bee-81845aad4104", 3, 0, 0.0, 349.0, 207, 550, 290.0, 550.0, 550.0, 550.0, 0.028460297884451192, 0.028543677663409546, 0.018250907171995068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4dd2d387-243a-4af3-9741-d14b3d641ce0", 3, 0, 0.0, 396.3333333333333, 255, 637, 297.0, 637.0, 637.0, 637.0, 0.03490807540144287, 0.029101426140330462, 0.022385712415638817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 478.68181818181813, 144, 1235, 455.0, 795.1999999999999, 1171.549999999999, 1235.0, 0.09330890336590662, 0.05731572286831569, 0.04218947486173317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=170c7524-121b-4c8c-9969-e578a0f8c098", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["login", 22, 6, 27.272727272727273, 1973.8181818181818, 1090, 3376, 1861.5, 2807.1, 3299.799999999999, 3376.0, 0.09327804489217906, 0.13988394303255403, 0.13984253765041085], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 242.4, 127, 448, 131.0, 448.0, 448.0, 448.0, 0.02503529977267948, 0.012444304281536967, 0.012566546956208255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 190.2, 122, 380, 128.0, 379.9, 380.0, 380.0, 0.1065706110225983, 0.08627640286888084, 0.03788252188693924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4dd2d387-243a-4af3-9741-d14b3d641ce0", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 13, 100.0, 182.99999999999997, 123, 382, 128.0, 381.2, 382.0, 382.0, 0.09068396637717555, 0.04507630750584214, 0.0455191003104182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07afdaab-52d6-430c-bd19-8b134440ab35", 3, 0, 0.0, 658.6666666666666, 389, 1181, 406.0, 1181.0, 1181.0, 1181.0, 0.024617000500545674, 0.024689120619199617, 0.015786292638696284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e704efc0-b87e-49be-9bee-81845aad4104", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07afdaab-52d6-430c-bd19-8b134440ab35", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abf36f53-2685-44f8-a006-301adceb52fe", 3, 0, 0.0, 665.6666666666667, 214, 1459, 324.0, 1459.0, 1459.0, 1459.0, 0.01734505087881591, 0.02391155288795097, 0.011122965570074006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 163.06666666666666, 126, 397, 129.0, 379.0, 397.0, 397.0, 0.09030921876505153, 0.07487551438625854, 0.03210210510788941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 139.31578947368422, 117, 375, 127.0, 137.0, 375.0, 375.0, 0.09610034899600425, 0.04776863050680289, 0.048237870492134946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 171.4736842105263, 121, 572, 130.0, 436.0, 572.0, 572.0, 0.0977803852547179, 0.07591348269287182, 0.034757871321013004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc0268fa-d606-44ca-87d7-edc23ef9795c", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, 100.0, 126.76190476190474, 117, 137, 127.0, 134.4, 136.8, 137.0, 0.10148408391283967, 0.05044472530433144, 0.0509402530578121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, 100.0, 151.1, 122, 378, 127.0, 353.0000000000001, 378.0, 378.0, 0.06032272658724174, 0.029984636555572312, 0.0342849871814206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0798f8f9-6d8b-43fc-a82b-aaf9d30312a2", 3, 0, 0.0, 459.3333333333333, 213, 710, 455.0, 710.0, 710.0, 710.0, 0.04645688800792864, 0.02944386749721259, 0.02979168924987612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87429cb9-bdbf-4e33-9184-042e2e7720d2", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 969.7391304347826, 225, 1870, 940.0, 1646.8000000000004, 1850.3999999999996, 1870.0, 0.09456498053194858, 0.029792465843540186, 0.04266505957593773], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 2.955665024630542, 0.9917355371900827], "isController": false}, {"data": ["401/Unauthorized", 16, 7.8817733990147785, 2.644628099173554], "isController": false}, {"data": ["404/Not Found", 181, 89.16256157635468, 29.917355371900825], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 605, 203, "404/Not Found", 181, "401/Unauthorized", 16, "406/Not Acceptable", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
