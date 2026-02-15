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

    var data = {"OkPercent": 65.25821596244131, "KoPercent": 34.74178403755869};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4839816933638444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6df2a797-16f2-4b28-a3d1-aea0b7e98b3a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b71a46d-1386-4d88-b927-b658d961ff3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=650f4577-6d5a-4f80-9c9f-1e853c088a64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b71a46d-1386-4d88-b927-b658d961ff3a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f09649ad-ee3b-47f1-b503-1ae69d58f487"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.42, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19bc0678-2676-40cd-90d8-4a9513ae1290"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97a98fb9-94d7-4a53-8979-4f1188b69a20"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/650f4577-6d5a-4f80-9c9f-1e853c088a64"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de9aadf0-34a0-4f0b-95f5-15f732b4d88f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/555deff9-de2d-4cd0-b20e-5b9f853869ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d87295ec-694b-4143-baeb-d0318df0c813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4332721-0164-4504-9890-64429c601733"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca68c8c0-6363-4376-bf62-765da8a56f83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19bc0678-2676-40cd-90d8-4a9513ae1290"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97a98fb9-94d7-4a53-8979-4f1188b69a20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6af8b85e-9125-484b-8016-c9d9fcf3c992"], "isController": false}, {"data": [0.8920454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d87295ec-694b-4143-baeb-d0318df0c813"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de9aadf0-34a0-4f0b-95f5-15f732b4d88f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6af8b85e-9125-484b-8016-c9d9fcf3c992"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=555deff9-de2d-4cd0-b20e-5b9f853869ff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ca00e92-7bab-41a8-a047-09e30cc009ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.76, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4332721-0164-4504-9890-64429c601733"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ca00e92-7bab-41a8-a047-09e30cc009ba"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/860ef505-5fd4-46a2-8521-d3df79af938d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f09649ad-ee3b-47f1-b503-1ae69d58f487"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84c42aee-fc46-4191-ad38-e5989d4ce323"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81678bf5-5b87-44a9-97e8-d1cee004fc14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d92e1b6-4bd0-41e7-a9fd-94db92475fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84c42aee-fc46-4191-ad38-e5989d4ce323"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81678bf5-5b87-44a9-97e8-d1cee004fc14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b8dce5b-f7f7-4913-9a19-7973c3b10c21"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 639, 222, 34.74178403755869, 304.0500782472615, 126, 1971, 149.0, 695.0, 1047.0, 1707.6000000000008, 2.516263171987966, 2.624856854306787, 1.206420858059524], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 60, 100.0, 752.7833333333334, 515, 1257, 790.0, 968.3, 1039.2499999999998, 1257.0, 0.2683087160086396, 1.7237481232364293, 0.4504127761902846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 199.73333333333332, 129, 447, 146.0, 444.6, 447.0, 447.0, 0.07174150102351208, 0.055697747376652444, 0.02550186169195156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 11, 100.0, 215.45454545454547, 135, 442, 149.0, 433.40000000000003, 442.0, 442.0, 0.16837078307720565, 0.08369211776005633, 0.0845142407243005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6df2a797-16f2-4b28-a3d1-aea0b7e98b3a", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 25, 25, 100.0, 171.28, 127, 426, 137.0, 396.6000000000001, 425.1, 426.0, 0.13047403827586387, 0.06485477097892062, 0.06549185124393948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b71a46d-1386-4d88-b927-b658d961ff3a", 3, 0, 0.0, 342.6666666666667, 236, 523, 269.0, 523.0, 523.0, 523.0, 0.04870208931963181, 0.03131075078329194, 0.031231483059789934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=650f4577-6d5a-4f80-9c9f-1e853c088a64", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b71a46d-1386-4d88-b927-b658d961ff3a", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.17255402340019102, 0.6585034622731615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 140.66666666666666, 137, 146, 139.0, 146.0, 146.0, 146.0, 0.05719296907766805, 0.016867457677202883, 0.03535463811148816], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 257.99999999999994, 126, 757, 143.0, 553.8, 571.65, 757.0, 0.2646132677092429, 0.13153139967187955, 0.12791364015241724], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 491.2352941176471, 140, 1244, 460.0, 953.5999999999997, 1244.0, 1244.0, 0.09349186620763994, 0.0194040735643499, 0.06249261001792844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 491.2352941176471, 140, 1244, 460.0, 953.5999999999997, 1244.0, 1244.0, 0.09169759212911022, 0.019031675112734098, 0.06129326643005092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 950.3461538461542, 153, 1820, 928.5, 1796.3, 1819.3, 1820.0, 0.10238316505741334, 0.03208703159701986, 0.046192404547387655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f09649ad-ee3b-47f1-b503-1ae69d58f487", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 139.88888888888889, 127, 158, 141.0, 158.0, 158.0, 158.0, 0.04718934988805638, 0.03714317969704437, 0.01677433921802004], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 453.3125, 138, 847, 460.0, 743.4000000000001, 847.0, 847.0, 0.09228550829127613, 0.022147620764239366, 0.06134530461427541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1150.2, 701, 1971, 1086.0, 1618.2000000000003, 1886.3999999999999, 1971.0, 0.10692488313110274, 0.055341980526840286, 0.049181269487059955], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 267.17647058823525, 136, 1119, 224.0, 463.7999999999994, 1119.0, 1119.0, 0.09424704923576731, 0.13791102281610182, 0.059045169977325264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 136.88888888888889, 127, 149, 137.0, 149.0, 149.0, 149.0, 0.049551558396511576, 0.024630608617016006, 0.024872559585748973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19bc0678-2676-40cd-90d8-4a9513ae1290", 3, 0, 0.0, 343.0, 269, 481, 279.0, 481.0, 481.0, 481.0, 0.04830062307803771, 0.031052646672892082, 0.030974032377517672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97a98fb9-94d7-4a53-8979-4f1188b69a20", 3, 0, 0.0, 399.6666666666667, 228, 570, 401.0, 570.0, 570.0, 570.0, 0.024941180382930257, 0.029479630849746016, 0.01599418143045983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/650f4577-6d5a-4f80-9c9f-1e853c088a64", 3, 0, 0.0, 710.3333333333334, 221, 1063, 847.0, 1063.0, 1063.0, 1063.0, 0.031347962382445145, 0.026133506400208985, 0.02010269723092999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de9aadf0-34a0-4f0b-95f5-15f732b4d88f", 3, 0, 0.0, 678.6666666666666, 218, 1119, 699.0, 1119.0, 1119.0, 1119.0, 0.029203901641259272, 0.029289459946848898, 0.018727762445729417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/555deff9-de2d-4cd0-b20e-5b9f853869ff", 3, 0, 0.0, 348.0, 224, 497, 323.0, 497.0, 497.0, 497.0, 0.08676538639518741, 0.03841175960203609, 0.055640563541184636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d87295ec-694b-4143-baeb-d0318df0c813", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4332721-0164-4504-9890-64429c601733", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["addBook", 58, 58, 100.0, 822.1206896551723, 546, 2147, 768.0, 1003.8000000000001, 1308.049999999999, 2147.0, 0.27281151076429555, 0.940531831047361, 0.5313926527862052], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca68c8c0-6363-4376-bf62-765da8a56f83", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19bc0678-2676-40cd-90d8-4a9513ae1290", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97a98fb9-94d7-4a53-8979-4f1188b69a20", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 25, 0, 0.0, 161.76, 128, 406, 140.0, 261.00000000000045, 403.0, 406.0, 0.13201808119640066, 0.09862678917504542, 0.04692830230028305], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 424.0625, 137, 1047, 401.0, 800.6000000000003, 1047.0, 1047.0, 0.09280957794844429, 0.018755646520220888, 0.06274729583343001], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6af8b85e-9125-484b-8016-c9d9fcf3c992", 3, 0, 0.0, 311.0, 214, 427, 292.0, 427.0, 427.0, 427.0, 0.07592437931819906, 0.03524354326424215, 0.048688485435173234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, 8.522727272727273, 214.3011363636364, 127, 1720, 147.0, 370.00000000000034, 476.05000000000007, 1341.929999999995, 0.7306694343539181, 1.6787469187856772, 0.34672580435910744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 161.92307692307693, 128, 408, 140.0, 308.3999999999999, 408.0, 408.0, 0.07634484378670425, 0.05912252062778952, 0.027138206189805027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d87295ec-694b-4143-baeb-d0318df0c813", 3, 0, 0.0, 343.0, 255, 401, 373.0, 401.0, 401.0, 401.0, 0.021072595090085345, 0.024907094001334597, 0.013513350367014364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de9aadf0-34a0-4f0b-95f5-15f732b4d88f", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6af8b85e-9125-484b-8016-c9d9fcf3c992", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.5360951409495549, 2.0458549703264093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 176.8571428571429, 130, 441, 138.0, 411.0, 441.0, 441.0, 0.06418043871914181, 0.031902190730510926, 0.032215571778944234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=555deff9-de2d-4cd0-b20e-5b9f853869ff", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca00e92-7bab-41a8-a047-09e30cc009ba", 3, 0, 0.0, 359.33333333333337, 211, 636, 231.0, 636.0, 636.0, 636.0, 0.07049700387733522, 0.03189805839501821, 0.04520803959581718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 173.39999999999998, 129, 395, 140.0, 386.6, 395.0, 395.0, 0.09183973354231975, 0.07453009626334738, 0.03264615528262147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 505.6, 167, 1025, 462.0, 913.4000000000003, 1014.1999999999999, 1025.0, 0.1062044648357017, 0.06523692224771128, 0.04802018283098621], "isController": false}, {"data": ["login", 25, 7, 28.0, 1991.92, 1254, 2941, 1990.0, 2597.0000000000005, 2865.7, 2941.0, 0.10741830837647968, 0.16122816722882247, 0.1610141698176037], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d4332721-0164-4504-9890-64429c601733", 3, 0, 0.0, 295.6666666666667, 205, 465, 217.0, 465.0, 465.0, 465.0, 0.024757990641479537, 0.02499170865209246, 0.015876706238188376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, 100.0, 197.46153846153845, 130, 396, 149.0, 393.2, 396.0, 396.0, 0.07519971308417162, 0.03737954488265953, 0.037746730981703336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 189.8181818181818, 133, 423, 140.0, 420.0, 423.0, 423.0, 0.15880807322495888, 0.12856630146825282, 0.05645130727918459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ca00e92-7bab-41a8-a047-09e30cc009ba", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 137.2, 127, 151, 139.0, 147.4, 151.0, 151.0, 0.07424566405321929, 0.03690531543270373, 0.03726784308921359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/860ef505-5fd4-46a2-8521-d3df79af938d", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f09649ad-ee3b-47f1-b503-1ae69d58f487", 3, 0, 0.0, 607.0, 239, 1127, 455.0, 1127.0, 1127.0, 1127.0, 0.039462260924469236, 0.025370431421167555, 0.025306202480860802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84c42aee-fc46-4191-ad38-e5989d4ce323", 3, 0, 0.0, 301.6666666666667, 224, 438, 243.0, 438.0, 438.0, 438.0, 0.08709031265422243, 0.04042668810056028, 0.055848930966412164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 161.64285714285717, 133, 423, 140.5, 289.0, 423.0, 423.0, 0.06536374926465782, 0.054193186646186026, 0.023234770246421333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, 100.0, 137.18750000000003, 128, 153, 136.0, 150.9, 153.0, 153.0, 0.07468190177462869, 0.03712215625320899, 0.037486813976717916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 157.875, 132, 430, 139.0, 238.2000000000002, 430.0, 430.0, 0.07538635506973237, 0.05852749246136449, 0.02679749340369393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81678bf5-5b87-44a9-97e8-d1cee004fc14", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d92e1b6-4bd0-41e7-a9fd-94db92475fd4", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84c42aee-fc46-4191-ad38-e5989d4ce323", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, 100.0, 178.0, 132, 406, 143.0, 401.5, 406.0, 406.0, 0.07724819846165731, 0.03839778614939801, 0.04394245664444861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 172.73333333333332, 128, 428, 137.0, 405.8, 428.0, 428.0, 0.09672240026308493, 0.04807783372452171, 0.048550111069556305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81678bf5-5b87-44a9-97e8-d1cee004fc14", 3, 0, 0.0, 319.0, 274, 383, 300.0, 383.0, 383.0, 383.0, 0.036868171707365026, 0.030735477780781853, 0.02364267521598604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b8dce5b-f7f7-4913-9a19-7973c3b10c21", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 950.3461538461542, 153, 1820, 928.5, 1796.3, 1819.3, 1820.0, 0.1030298707371391, 0.03228971008979449, 0.04648417996148268], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.6036036036036037, 1.2519561815336464], "isController": false}, {"data": ["401/Unauthorized", 22, 9.90990990990991, 3.4428794992175273], "isController": false}, {"data": ["404/Not Found", 192, 86.48648648648648, 30.046948356807512], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 639, 222, "404/Not Found", 192, "401/Unauthorized", 22, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 25, 25, "404/Not Found", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
